import { forwardRef } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';

type UserType = {
  id: string;
  name: string;
  email: string;
};

type MenuType = {
  duration: number;
  name: string;
  description?: string;
};

export type ScheduleCardProps = {
  date: string;
  user: UserType;
  menu: MenuType;
};

export const ScheduleCard = forwardRef<HTMLDivElement, ScheduleCardProps>(
  ({ date, user, menu }, ref) => {
    return (
      <div
        // eslint-disable-next-line max-len
        className="bg-white flex h-[595px] w-[420px] flex-col gap-y-4 px-[50px] pb-[75px] pt-8 print:h-[100vh] print:w-[100vw]"
        ref={ref}
      >
        <section className="flex items-end justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-[17px] font-bold leading-[17px] tracking-[8px]">
              診療予約票
            </h1>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-right text-[6px] leading-[6px]">
              発行日: {format(date, 'yyyy年MM月dd日')}
            </p>
            <p className="text-right text-[6px] leading-[6px]">
              〇〇クリニック
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-end gap-x-2 py-2.5 text-[9px] font-bold">
            <span className="text-[14px]">{user.name}</span>
            <span>様</span>
          </div>
        </section>

        <section className="flex flex-col gap-y-1">
          <h2 className="text-[8px] font-bold">次回の予約</h2>
          <div className="border flex items-center flex-col justify-center gap-x-1 px-5 py-2.5 font-bold">
            <span className="text-[20px]">
              {format(date, 'yyyy年MM月dd日(E)', { locale: ja })}
            </span>
            <span className="text-[20px]">{format(date, 'HH:mm')} ~</span>
          </div>
        </section>

        <table>
          <h2 className="text-[8px] font-bold mb-1">予約内容</h2>
          <tr className="border">
            <td className="flex flex-col gap-y-0.5 px-5 py-2.5">
              <span className="text-[14px] font-bold leading-[17.5px]">
                {menu.name}
              </span>
            </td>
          </tr>
          <tr className="border">
            <td className="flex flex-col px-5 py-6">
              <p className="whitespace-pre-wrap text-[8px] font-bold">
                {menu.description}
              </p>
            </td>
          </tr>
        </table>
        <section>
          <p className="text-[8px] font-bold">注意事項</p>
          <p className="text-[8px]">
            予約した時間より遅れる場合がありますのでご了承ください
          </p>
        </section>
      </div>
    );
  }
);

ScheduleCard.displayName = 'ScheduleCard';
