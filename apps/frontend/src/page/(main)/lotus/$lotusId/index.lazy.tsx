// import { HTMLProps } from 'react';
// import { Button } from '@froxy/design/components';
// import { cn } from '@froxy/design/utils';
// import { useMutation } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import { AsyncBoundary } from '@/shared/components/AsyncBoundary';
import { SuspenseLotusHistoryList } from '@/widget/History';
import { SuspenseLotusDetail } from '@/widget/SuspenseLotusDetail';
import { SuspenseLotusFiles } from '@/widget/SuspenseLotusFiles';
import '@/app/style/github.css';

export const Route = createLazyFileRoute('/(main)/lotus/$lotusId/')({
  component: RouteComponent
});

function RouteComponent() {
  const { lotusId: id } = Route.useParams();

  return (
    <div className="flex flex-col gap-16">
      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusDetail id={id} />
      </AsyncBoundary>

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusFiles id={id} />
      </AsyncBoundary>

      {/* <CreateHistoryButton /> */}

      <AsyncBoundary pending={<div>Loading...</div>} rejected={() => <div>Error!</div>}>
        <SuspenseLotusHistoryList id={id} />
      </AsyncBoundary>
    </div>
  );
}

// interface PostCodeRunProps {
//   lotusId: string;
//   input: string;
//   execFileName: string;
// }

// const postCodeRun = async ({ lotusId, input, execFileName }: PostCodeRunProps) => {
//   const body = {
//     input,
//     execFileName
//   };
//   const res = await fetch(`/api/lotus/${lotusId}/history`, {
//     method: 'POST',
//     body: JSON.stringify(body)
//   });

//   const data = await res.json();

//   return data;
// };

// const useCodeRunMutaion = () => {
//   const mutation = useMutation({
//     mutationFn: postCodeRun
//   });

//   return mutation;
// };

// type ModalBox = HTMLProps<HTMLDivElement>;

// function ModalBox({ children, className, ...props }: ModalBox) {

//   return (
//     <div className={cn('fixed inset-0 z-50 flex justify-center items-center bg-opacity-40 bg-gray-500', className)}>
//       {children}
//     </div>
//   );
// }

// function CodeRunModal() {
//   return <div className=""></div>;
// }

// function CreateHistoryButton() {
//   return <Button>실행하기</Button>;
// }
