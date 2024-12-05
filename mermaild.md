stateDiagram-v2
    direction LR
    사용자request --> Pool: 코드실행 요청
    
    state "Pool" as Pool
    Pool --> Allocated: 컨테이너 할당
    Allocated --> Started: 컨테이너 Start
    Started --> Running: 작업 실행 중
    Running --> Finish: 작업 완료
    Finish --> Exited: 컨테이너 stop
    Finish --> 사용자request: 코드실행결과 반환
    Exited --> Pool: 컨테이너 Stop 후 반납