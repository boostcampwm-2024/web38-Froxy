import * as Docker from "dockerode";
import path from "path";
import { promises as fs } from 'fs';


const TEMP_DIR = path.join(__dirname, 'temp');

// 입력 처리를 위한 stdin 래퍼 코드
const INPUT_WRAPPER_TEMPLATE = `
process.stdin.resume();
process.stdin.setEncoding('utf-8');

const inputs = process.argv[2] ? JSON.parse(process.argv[2]) : [];
let currentInput = 0;

// stdin으로 들어오는 입력 요청을 가로채서 미리 준비된 입력값을 제공
process.stdin.on('data', () => {
    if (currentInput < inputs.length) {
        process.stdout.write(inputs[currentInput] + '\\n');
        currentInput++;
    } else {
        console.log('ERROR: Not enough inputs provided');
        process.exit(1);
    }
});

// 사용자 코드 실행
%USER_CODE%
`;

const DOCKERFILE_TEMPLATE = `
FROM node:16-alpine
WORKDIR /app
COPY . .
CMD ["node", "main.js"]
`;

const docker = new Docker();

async function createTempDirectory(code) {
    const dirId = "direc";
    const tempPath = path.join(TEMP_DIR, dirId);
    
    // 사용자 코드를 입력 처리 래퍼로 감싸기
    const wrappedCode = INPUT_WRAPPER_TEMPLATE.replace('%USER_CODE%', code);
    
    await fs.mkdir(tempPath);
    await fs.writeFile(path.join(tempPath, 'index.js'), wrappedCode);
    await fs.writeFile(path.join(tempPath, 'Dockerfile'), DOCKERFILE_TEMPLATE);
    
    return { dirId, tempPath };
}

async function buildImage(tempPath, imageTag) {
    const stream = await docker.buildImage({
        context: tempPath,
        src: ['Dockerfile', 'main.js']
    }, { t: imageTag });

    return new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

async function runContainer(imageTag, inputs) {
    const container = await docker.createContainer({
        Image: imageTag,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        Cmd: ['node', 'index.js', JSON.stringify(inputs)],
        HostConfig: {
            Memory: 512 * 1024 * 1024,
            CPUQuota: 100000,
            CPUPeriod: 100000,
        }
    });

    await container.start();
    const logs = await container.logs({
        follow: true,
        stdout: true,
        stderr: true
    });

    await container.stop();
    await container.remove();
    await docker.getImage(imageTag).remove();

    return logs.toString();
}

async function runDockerImage(req,res){
    const { code, inputs = [] } = req.body;

        const { dirId, tempPath } = await createTempDirectory(code);
        const imageTag = `code-execution-${dirId}`;

        try {
            await buildImage(tempPath, imageTag);
            const output = await runContainer(imageTag, [1,2,3,4]);
            await fs.rm(tempPath, { recursive: true });

            res.json({
                success: true,
                output: output
            });

        } catch (error) {
            await fs.rm(tempPath, { recursive: true });
            throw error;
        }
}