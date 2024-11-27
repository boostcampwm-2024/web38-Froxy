import { useEffect, useRef, useState } from 'react';
import { AutoPlay, cn } from '@froxy/design';
import { OnBoardingItems } from './constant';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, Heading } from '@/components';

export function OnBoardingCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      if (!ref.current) return;

      ref.current.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    });
  }, [api]);

  return (
    <Carousel
      ref={ref}
      opts={{ loop: true }}
      plugins={[AutoPlay({ delay: 3000 })]}
      setApi={setApi}
      orientation="vertical"
      className="transition-colors duration-500 ease-in-out hidden lg:flex"
    >
      <CarouselContent className="w-screen h-screen m-0">
        {OnBoardingItems.map((item) => (
          <CarouselItem className="min-h-full p-0" key={item.title}>
            <div className={cn('w-full h-full flex flex-col items-start justify-center p-20')}>
              <div className="w-1/2 flex flex-col justify-center items-center gap-10">
                <div className="rounded-full bg-white shadow-lg p-5">{item.icon}</div>

                <div className={cn('flex gap-5 w-full pr-10', item?.description ? 'justify-start' : 'justify-center')}>
                  <div className="rounded-lg p-5 bg-white shadow-lg">
                    <Heading size="sm">{item.title}</Heading>
                  </div>
                </div>

                <div className="pl-10">
                  {item?.description && (
                    <div className="rounded-lg p-5 bg-white shadow-lg">
                      <Heading size="sm">{item.description}</Heading>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
