import type { Meta, StoryObj } from '@storybook/react';
import { ScheduleCard, type ScheduleCardProps } from '.';
import { FC, useRef, useState } from 'react';

import { ReactToPrint } from 'react-to-print';
import { ja } from 'date-fns/locale/ja';
import { format, set } from 'date-fns';

const mockProps = (
  props?: Partial<ScheduleCardProps> & { id: string }
): ScheduleCardProps & { id: string } => ({
  id: props?.id || 'xxx',
  date: props?.date || new Date().toISOString(),
  menu: props?.menu || {
    name: '皮膚科 (初診)',
    duration: 15,
    description: '予約内容の説明です',
  },
  user: props?.user || {
    email: 'xxx@example.com',
    id: '12345',
    name: '山田 太郎',
  },
});

const meta = {
  title: 'Components/ScheduleCard',
  component: ScheduleCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ScheduleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Preview: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: mockProps(),
  decorators: [
    (Story: FC) => (
      <div className="h-screen w-screen bg-slate-100">
        <Story />
      </div>
    ),
  ],
};

export const Print = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="hidden">
        <ScheduleCard {...mockProps()} ref={contentRef} />
      </div>

      <ReactToPrint
        content={() => contentRef.current}
        pageStyle={`
          @media print {
            @page {
              margin:0 ;
              size: A5 portrait;
            }
          }`}
        trigger={() => (
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-200 active:bg-gray-300">
            印刷
          </button>
        )}
      />
    </>
  );
};

const loopedProps = Array.from({ length: 10 }).map((_, i) =>
  mockProps({
    id: `id_${i.toString()}`,
    date: set(new Date(), {
      hours: i + 9,
      date: i + 1,
      minutes: i * 15,
    }).toISOString(),
  })
);

export const Loop = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [contentData, setContentData] = useState<ScheduleCardProps | undefined>(
    undefined
  );

  return (
    <>
      {contentData && (
        <div className="hidden">
          <ScheduleCard {...contentData} ref={contentRef} />
        </div>
      )}
      <table className="table-auto">
        <thead className="bg-gray-300">
          {Object.keys({ ...mockProps(), schedule: null }).map((key) => (
            <th className="text-start px-4" key={key}>
              {key}
            </th>
          ))}
        </thead>
        <tbody>
          {loopedProps.map((data) => (
            <tr className="even:bg-gray-200 text-sm" key={data.id}>
              <td className="py-2 px-4">{data.id}</td>
              <td className="py-2 px-4">
                {format(data.date, 'yyyy年MM月dd日 HH:mm', { locale: ja })}
              </td>
              <td className="py-2 px-4">{data.menu.name}</td>
              <td className="py-2 px-4">{data.user.name}</td>
              <td className="py-2 px-4">
                <ReactToPrint
                  content={() => contentRef.current}
                  onBeforeGetContent={() => {
                    setContentData(data);

                    return Promise.resolve();
                  }}
                  trigger={() => <button className="underline">予約票</button>}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
