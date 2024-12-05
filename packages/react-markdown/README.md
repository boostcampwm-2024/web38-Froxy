# @froxy/react-markdown

마크다운을 렌더링하는 React 컴포넌트 라이브러리입니다.

[react-markdown](https://github.com/remarkjs/react-markdown) 라이브러리는 비동기 rehype 플러그인을 지원하지 않습니다. 따라서 비동기 플러그인 라이브러리들과 함께 사용하기 위해 만들었습니다.

## 사용방법

```ts
<Markdown markdown={`# Hello world \n\n _hola_`} />
```

```ts
<div>
  <h1>Hello world</h1>
  <p>
    <em>hola</em>
  </p>
</div>
```

Markdown 컴포넌트를 통해 markdown 형식의 문자열을 React 컴포넌트로 파싱해 랜더링할 수 있습니다.

## Options

@froxy/react-markdown 컴포넌트는 다음 옵션을 제공합니다:

- markdown : 마크다운 문자열입니다.
- components : 사용자 커스텀 마크다운 컴포넌트를 받아 랜더링 시 해당 컴포넌트로 랜더링합니다.
