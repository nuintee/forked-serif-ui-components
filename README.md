## はじめに

最近、印刷可能なオンライン予約票機能を実装する機会があったので、
その時の手順・Tipsをまとめました。

## 実装するもの

[react-to-print](https://www.npmjs.com/package/react-to-print)を用いて印刷可能なオンライン予約票を実装します。
![](https://storage.googleapis.com/zenn-user-upload/9a926987085d-20240512.png)

## 実装ステップ

### 1. 予約票のコンポーネントを実装

![](https://storage.googleapis.com/zenn-user-upload/ce6f76029267-20240512.png)
好きなレイアウトで予約票コンポーネントを実装します。
今回は`ScheduleCard`として上記写真のものを実装しました。

注意点として、
コンポーネント内でrefを受け取れるようにして下さい。

```tsx
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
```

### 2. ReactToPrintコンポーネントからの呼び出し

## Tips

### Storybookでの印刷プレビューを用意しよう

### 印刷用CSSで任意の印刷サイズを指定しよう (A5とかA6とか)

### ループデータから個別の予約表を開く際の実装

このようにテーブルで一覧を表示する際に予約票をそれぞれ印刷させるケースを考えてみましょう。
![](https://storage.googleapis.com/zenn-user-upload/71e886617f20-20240512.png)

ループ内で個数分の予約票コンポーネントを他のデータと一緒に表示するのは描画が重くなるので避けたいです。
代わりに予約票コンポーネントの呼び出しは一箇所のみにして、`ReactToPrint`の`onBeforeGetContent`コールバックでテーブル内のデータをstateで設定して渡すのが良さそうです。

```tsx
{loopedData.map((schedule) => (
...
<!-- 予約票出力ボタンカラム -->
<td className="py-2 px-4">
    <ReactToPrint
      content={() => contentRef.current}
      onBeforeGetContent={() => {
        // ここでループさせている任意データの一つを予約票のprops stateに設定します
        setContentData(schedule);
        // stateを正しく更新させるためにPromiseをresolveする必要があります
        return Promise.resolve();
      }}
      trigger={() => <button className="underline">予約票</button>}
    />
</td>
)}
```

## 主な使用技術

- react@^18.2.0
- react-to-print@^2.15.1 (Reactコンポーネントの印刷)
- date-fns@^3.6.0 (日付操作・フォーマット)

その他tailwindcssやeslint・prettier等

## おわりに

今回は印刷可能な予約票を実装しましたが、
他にも領収書・請求書・チケットなど同じ実装方法で実現できるので、
いずれかを実装するタイミングがあればこの記事を参考にして頂けたらありがたいです。
