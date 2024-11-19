import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GistApiFileDto } from '@/gist/dto/gistApiFile.dto';

export class SimpleFileResponseDto {
  @IsString()
  @ApiProperty({
    example: 'index.js'
  })
  filename: string;

  @IsString()
  @ApiProperty({
    example: 'JavaScript'
  })
  language: string;

  @IsString()
  @ApiProperty({
    example:
      'class Room{\n    constructor(name, maxP){\n        this.name = name;\n        this.mapP = maxP;\n        this.timeAMUsing = 0;\n        this.timePMUsing = 0;\n        this.waitAM = 0;\n        this.waitPM = 0;\n        this.curReserv = [];\n        this.waitReserv = [];\n    }\n    add(reserv){\n        if(reserv.AMPM == 0){\n            this.amAdd(reserv);\n        }\n        else if(reserv.AMPM == 1){\n            this.pmAdd(reserv);\n        }\n    }\n    amAdd(reserv){\n        if(this.timeAMUsing + reserv.time > 4){\n            this.waitAM += reserv.time;\n            if(this.waitAM>4) this.waitAM = 4;\n            this.waitReserv.push(reserv);\n        }\n        else{\n            this.timeAMUsing += reserv.time;\n            this.curReserv.push(reserv);\n        }\n    }\n    pmAdd(reserv){\n        if(this.timePMUsing + reserv.time > 4){\n            this.waitPM += reserv.time;\n            if(this.waitPM>4) this.waitPM = 4;\n            this.waitReserv.push(reserv);\n        }\n        else{\n            this.timePMUsing += reserv.time;\n            this.curReserv.push(reserv);\n        }\n    }\n\n    print(){\n        this.printUsing();\n        if(this.waitAM > 0|| this.waitPM>0){\n            this.printWaiting();\n        }\n    }\n    printUsing(){\n        var str = "";\n        str += this.name + "|";\n        str += "🁢 |".repeat(this.timeAMUsing);\n        str += "  |".repeat(4-this.timeAMUsing);\n        str += "|";\n        str += "🁢 |".repeat(this.timePMUsing);\n        str += "  |".repeat(4-this.timePMUsing);\n        console.log(str);\n    }\n    printWaiting(){\n        var str = "";\n        str += "예약대기" + "|";\n        str += "🁢 |".repeat(this.waitAM);\n        str += "  |".repeat(4-this.waitAM);\n        str += "|";\n        str += "🁢 |".repeat(this.waitPM);\n        str += "  |".repeat(4-this.waitPM);\n        console.log(str);\n    }\n}\n\nclass Reservation{\n    constructor(sp){\n        this.valid = true;\n        if(sp.length != 3) this.valid = false;\n        var t = this.checkTimeAP(sp[0]);\n        var r = this.checkRoom(sp[1]);\n        var p = parseInt(sp[1]);\n        var time = parseInt(sp[2]);\n        if(t==-1 || r == -1) this.valid = false;\n        if(time<1 || time>4) this.valid = false;\n        this.AMPM = t;\n        this.room = r;\n        this.time = time;\n        this.numP = p;\n    }\n\n    checkTimeAP(tInp){\n        // 오전 : 0, 오후 : 1, 에러 : -1 반환\n        var timeAP = -1;\n        switch(tInp){\n            case "AM":\n                timeAP = 0;\n                break;\n            case "PM":\n                timeAP = 1;\n                break;\n        }\n        return timeAP;\n    }\n    checkRoom(tInp){\n        // 회의실 A : 0, 회의실 B : 1, 회의실 C : 2, 에러 : -1\n        var numOfPeople = parseInt(tInp);\n        if(numOfPeople < 2) return -1;\n        else if(numOfPeople <= 5) return 0;\n        else if(numOfPeople <= 10) return 1;\n        else if(numOfPeople <= 20) return 2;\n        else return -1;\n    }\n}\n\n//preprocessing\nlet rooms = [];\nrooms.push(new Room("회의실 A",5));\nrooms.push(new Room("회의실 B",10));\nrooms.push(new Room("회의실 C",20));\n\nfunction reserSolution(inpString){\n    let sp = inpString.trim().split("-");\n    var res = new Reservation(sp);\n    if(res.valid){\n        rooms[res.room].add(res);\n    }\n    console.log("        |오|전|시|간||오|후|시|간|");\n    console.log("----------------------------------");\n    rooms.forEach(item=>{\n        item.print()\n    })\n}\n\n//reserSolution("AM-03-2");\n//reserSolution("AM-03-2");\n\nconst readline = require(\'readline\');\n\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nrl.on(\'line\', (answer) => {\n    if(answer == "p"){\n        rooms.forEach(item=>{\n            item.print()\n        })\n    }\n    else if(answer == "q")\n        rl.close();\n    else{\n        reserSolution(answer);\n    }\n});'
  })
  content: string;

  static ofFileApiDto(fileApiDto: GistApiFileDto) {
    return {
      filename: fileApiDto.fileName,
      language: fileApiDto.language,
      content: fileApiDto.content
    };
  }
}
