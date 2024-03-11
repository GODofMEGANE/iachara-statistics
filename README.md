https://www.godofmegane.com/iachara-statistics/  

# iachara-statistics
いあきゃらの探索者一覧をソート・絞り込みをして表示します  
いあきゃらで利用しているIDとパスワードを入力し決定ボタンをクリックすることでいあきゃら内のキャラシを読み込むことができます  
入力されたIDとパスワードは https://github.com/GODofMEGANE/iachara-statistics/blob/main/src/App.tsx 136行目から使用しており、いあきゃらに関するサーバ以外への送信は一切行っておりません  
もしIDとパスワードを入力したくない場合は以下の手順を参考に直接JSONレスポンスを入力することでも使用することができます  

## レスポンスの手動読み込み方法
1.いあきゃらのマイページを開く  
2.F12を押しNetworkタブを開く  
3.一度ページをリロードする  
4.Responseが大量に出てくるのでNameがcharasheetのものを探してクリックする  
5.右ウインドウでResponseタブをクリックして全てコピー  
6.「charasheetのレスポンスをペーストしてね」と書かれた入力欄にペーストして決定ボタンをクリック  
