import React, { ReactPropTypes, useState, useMemo, ReactElement } from 'react';
import './css/App.css';
import { JsxElement, setTextRange } from 'typescript';
import Select from 'react-select';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import Nouislider, { Formatter } from "nouislider-react";
import "nouislider/distribute/nouislider.css";

const sort_options: { value: string, label: string }[] = [
  { value: "create", label: "作成日時" },
  { value: "update", label: "更新日時" },
  { value: "str", label: "STR" },
  { value: "con", label: "CON" },
  { value: "pow", label: "POW" },
  { value: "dex", label: "DEX" },
  { value: "app", label: "APP" },
  { value: "siz", label: "SIZ" },
  { value: "int", label: "INT" },
  { value: "edu", label: "EDU" },
  { value: "san", label: "現在SAN値" },
  { value: "db", label: "ダメージボーナス" },
  { value: "memo", label: "メモ欄文字数" },
  { value: "age", label: "年齢" },
  { value: "height", label: "身長" },
  { value: "skill", label: "技能値" },
];

const filt_options: { value: string, label: string }[] = [
    { value: "create", label: "作成日時" },
    { value: "update", label: "更新日時" },
    { value: "str", label: "STR" },
    { value: "con", label: "CON" },
    { value: "pow", label: "POW" },
    { value: "dex", label: "DEX" },
    { value: "app", label: "APP" },
    { value: "siz", label: "SIZ" },
    { value: "int", label: "INT" },
    { value: "edu", label: "EDU" },
    { value: "san", label: "現在SAN値" },
    { value: "db", label: "ダメージボーナス" },
    { value: "memo", label: "メモ欄文字数" },
    { value: "age", label: "年齢" },
    { value: "height", label: "身長" },
    { value: "skill", label: "技能値" },
    { value: "notlost", label: "ロスト以外" },
    { value: "lost", label: "ロスト" },
    { value: "6th", label: "6版"},
    { value: "7th", label: "7版"},
  ];

const sort_order: { value: string, label: string }[] = [
  { value: "ascend", label: "昇順(小さい順)" },
  { value: "descend", label: "降順(大きい順)" },
];

const skill_list: { value: string, label: string }[] = [
  { value: "", label: "---戦闘技能---" },
  { value: "回避", label: "回避" },
  { value: "キック", label: "キック" },
  { value: "組み付き", label: "組み付き" },
  { value: "こぶし（パンチ）", label: "こぶし（パンチ）" },
  { value: "頭突き", label: "頭突き" },
  { value: "投擲", label: "投擲" },
  { value: "マーシャルアーツ", label: "マーシャルアーツ" },
  { value: "拳銃", label: "拳銃" },
  { value: "サブマシンガン", label: "サブマシンガン" },
  { value: "ショットガン", label: "ショットガン" },
  { value: "マシンガン", label: "マシンガン" },
  { value: "ライフル", label: "ライフル" },
  { value: "", label: "---探索技能---" },
  { value: "応急手当", label: "応急手当" },
  { value: "鍵開け", label: "鍵開け" },
  { value: "隠す", label: "隠す" },
  { value: "隠れる", label: "隠れる" },
  { value: "聞き耳", label: "聞き耳" },
  { value: "忍び歩き", label: "忍び歩き" },
  { value: "写真術", label: "写真術" },
  { value: "精神分析", label: "精神分析" },
  { value: "追跡", label: "追跡" },
  { value: "登攀", label: "登攀" },
  { value: "図書館", label: "図書館" },
  { value: "目星", label: "目星" },
  { value: "", label: "---行動技能---" },
  { value: "運転", label: "運転" },
  { value: "機械修理", label: "機械修理" },
  { value: "重機械操作", label: "重機械操作" },
  { value: "乗馬", label: "乗馬" },
  { value: "水泳", label: "水泳" },
  { value: "製作", label: "製作" },
  { value: "操縦", label: "操縦" },
  { value: "跳躍", label: "跳躍" },
  { value: "電気修理", label: "電気修理" },
  { value: "ナビゲート", label: "ナビゲート" },
  { value: "変装", label: "変装" },
  { value: "", label: "---交渉技能---" },
  { value: "言いくるめ", label: "言いくるめ" },
  { value: "信用", label: "信用" },
  { value: "説得", label: "説得" },
  { value: "値切り", label: "値切り" },
  { value: "母国語", label: "母国語" },
  { value: "", label: "---知識技能---" },
  { value: "医学", label: "医学" },
  { value: "オカルト", label: "オカルト" },
  { value: "化学", label: "化学" },
  { value: "クトゥルフ神話", label: "クトゥルフ神話" },
  { value: "芸術", label: "芸術" },
  { value: "経理", label: "経理" },
  { value: "考古学", label: "考古学" },
  { value: "コンピューター", label: "コンピューター" },
  { value: "心理学", label: "心理学" },
  { value: "人類学", label: "人類学" },
  { value: "生物学", label: "生物学" },
  { value: "地質学", label: "地質学" },
  { value: "電子工学", label: "電子工学" },
  { value: "天文学", label: "天文学" },
  { value: "博物学", label: "博物学" },
  { value: "物理学", label: "物理学" },
  { value: "法律", label: "法律" },
  { value: "薬学", label: "薬学" },
  { value: "歴史", label: "歴史" },
];

function App() {
  const [charasheet, setCharasheet] = useState<IacharaSheet | null>(null);
  return (
    <div>
      <AuthForm setCharasheet={setCharasheet} />
      {
        charasheet !== null ? <Statistics charasheet={charasheet} /> : <div></div>
      }
    </div>
  );
}

function AuthForm({ setCharasheet }: { setCharasheet: React.Dispatch<React.SetStateAction<IacharaSheet | null>> }) {
  const [auth_status, setAuthStatus] = useState<'pending' | 'success' | 'failed' | 'none'>('none');
  const [login_id, setLoginId] = useState<string>(((document.cookie + ';').match('userid=([^¥S;]*)') ?? "")[1]);
  const [password, setPassword] = useState<string>("");
  const [raw_json, setRawJson] = useState<string>("");
  async function getCharasheet(login_id: string, password: string): Promise<IacharaSheet> {
    setAuthStatus('pending');
    document.cookie = `userid=${login_id}`;
    const res = await fetch(
      "https://apiv3.iachara.com/v3/auth/login",
      {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(
          {
            loginId: login_id,
            password: password
          }
        )
      }
    )
    const auth = res.json();
    return auth.then(async (value) => {
      console.log(value);
      const g_res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyBRP4ntIWd48qx6Liqk-1DnigSMM_xNLgs",
        {
          method: "POST",
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(
            {
              returnSecureToken: true,
              token: value.token,
            }
          )
        }
      )
      const g_auth = g_res.json();
      return await g_auth.then(async (g_value) => {
        console.log(g_value);
        if (value.success === true) {
          setAuthStatus('success');
          return await (await fetch("https://apiv3.iachara.com/v3/user/charasheet", {
            "headers": {
              "authorization": `Bearer ${g_value.idToken}`,
              "content-type": "application/json",
            },
            "method": "GET",
          })).json();
        }
        else {
          console.log("Invalid auth");
          setAuthStatus('failed');
          return null;
        }
      })
    })
  }

  return (
    <div className='outline'>
      ここにいあきゃらのIDとパスワードを入力
      <input type='text' id='login_id' className='input' value={login_id} onChange={(evt) => { setLoginId(evt.target.value) }} placeholder='ユーザーID' onKeyDown={(e) => {
        if (e.key === "Enter") getCharasheet(login_id, password).then((result) => {
          console.log(result);
          setCharasheet(result);
        })
      }} />
      <input type='password' id='password' className='input' value={password} onChange={(evt) => { setPassword(evt.target.value) }} placeholder='パスワード' onKeyDown={(e) => {
        if (e.key === "Enter") getCharasheet(login_id, password).then((result) => {
          console.log(result);
          setCharasheet(result);
        })
      }} />
      <input type='button' id='submit' value="決定" onClick={() => {
        getCharasheet(login_id, password).then((result) => {
          console.log(result);
          setCharasheet(result);
        })
      }} />
      {auth_status === 'pending' ? (<span style={{ color: 'orange' }}>通信中...</span>) : auth_status === 'success' ? (<span style={{ color: 'green' }}>ログイン成功!</span>) : auth_status === 'failed' ? (<span style={{ color: 'red' }}>IDまたはパスワードが間違っています</span>) : (<span></span>)}
      <br />
      パスワードを入れたくない方はこちらに
      <input type='text' id='raw_json' className='input' style={{ width: "20rem" }} onChange={(evt) => { setRawJson(evt.target.value) }} placeholder='charasheetのレスポンスをペーストしてね' onKeyDown={(e) => {
        if (e.key === "Enter") try {
          setCharasheet(JSON.parse(raw_json));
        } catch (e) {
          alert("JSONの構文解析に失敗しました");
        }
      }} />
      <input type='button' id='submit-rawjson' value="決定" onClick={() => {
        try {
          setCharasheet(JSON.parse(raw_json));
        } catch (e) {
          alert("JSONの構文解析に失敗しました");
        }
      }} title={"1.いあきゃらのマイページを開く\n2.F12を押しNetworkタブを開く\n3.一度ページをリロードする\n4.いっぱい出てくるのでNameがcharasheetのものを探してクリックする\n5.右ウインドウでResponseタブをクリックして全てコピー\n6.左の入力欄にペーストしてこのボタンをクリック"} />
    </div>
  )
}

function Statistics({ charasheet }: { charasheet: IacharaSheet }) {
  const [filt_mode, setFiltMode] = useState<SortAndFilterMode>({
    sortBy: [{
      priority: 1,
      condition: "create",
      subCondition: "回避",
      order: 'ascend',
    }], filterBy: []
  });

  let statistics_average: StatisticsAverage = {
    str: 0,
    con: 0,
    pow: 0,
    dex: 0,
    app: 0,
    siz: 0,
    int: 0,
    edu: 0,
    validNumber: 0,
    additional: {
      memoLength: 0,
      age: {
        average: 0,
        validNumber: 0,
      },
      height: {
        average: 0,
        validNumber: 0,
      },
      sex: {
        maleRate: 0,
        femaleRate: 0,
        otherRate: 0,
        validNumber: 0,
      }
    }
  };
  let ignore_list: { abilities: string[], age: string[], height: string[], male: string[], female: string[], other: string[] } = { abilities: [], age: [], height: [], male: [], female: [], other: [] };
  function calcStatistics() {
    for (let i = 0; i < charasheet.length; i++) {
      if (charasheet[i].data.abilities.sanCurrent >= 0) {
        statistics_average.str += charasheet[i].data.abilities.str.value + charasheet[i].data.abilities.str.fixedDiff + charasheet[i].data.abilities.str.tmpFixedDiff;
        statistics_average.con += charasheet[i].data.abilities.con.value + charasheet[i].data.abilities.con.fixedDiff + charasheet[i].data.abilities.con.tmpFixedDiff;
        statistics_average.pow += charasheet[i].data.abilities.pow.value + charasheet[i].data.abilities.pow.fixedDiff + charasheet[i].data.abilities.pow.tmpFixedDiff;
        statistics_average.dex += charasheet[i].data.abilities.dex.value + charasheet[i].data.abilities.dex.fixedDiff + charasheet[i].data.abilities.dex.tmpFixedDiff;
        statistics_average.app += charasheet[i].data.abilities.app.value + charasheet[i].data.abilities.app.fixedDiff + charasheet[i].data.abilities.app.tmpFixedDiff;
        statistics_average.siz += charasheet[i].data.abilities.siz.value + charasheet[i].data.abilities.siz.fixedDiff + charasheet[i].data.abilities.siz.tmpFixedDiff;
        statistics_average.int += charasheet[i].data.abilities.int.value + charasheet[i].data.abilities.int.fixedDiff + charasheet[i].data.abilities.int.tmpFixedDiff;
        statistics_average.edu += charasheet[i].data.abilities.edu.value + charasheet[i].data.abilities.edu.fixedDiff + charasheet[i].data.abilities.edu.tmpFixedDiff;
        statistics_average.validNumber++;
      }
      else {
        ignore_list.abilities.push(charasheet[i].data.profile.name);
      }
      statistics_average.additional.memoLength += charasheet[i].data.memo.length;
      if (!isNaN(parseInt(charasheet[i].data.profile.age))) {
        statistics_average.additional.age.average += parseInt(charasheet[i].data.profile.age);
        statistics_average.additional.age.validNumber++;
      }
      else {
        ignore_list.age.push(charasheet[i].data.profile.name);
      }
      if (!isNaN(parseInt(charasheet[i].data.profile.height))) {
        statistics_average.additional.height.average += parseInt(charasheet[i].data.profile.height);
        statistics_average.additional.height.validNumber++;
      }
      else {
        ignore_list.height.push(charasheet[i].data.profile.name);
      }
      if (charasheet[i].data.profile.sex.includes("男")) {
        statistics_average.additional.sex.maleRate++;
        statistics_average.additional.sex.validNumber++;
        ignore_list.male.push(charasheet[i].data.profile.name);
      }
      else if (charasheet[i].data.profile.sex.includes("女")) {
        statistics_average.additional.sex.femaleRate++;
        statistics_average.additional.sex.validNumber++;
        ignore_list.female.push(charasheet[i].data.profile.name);
      }
      else {
        statistics_average.additional.sex.otherRate++;
        statistics_average.additional.sex.validNumber++;
        ignore_list.other.push(charasheet[i].data.profile.name);
      }
    }
    statistics_average.str /= statistics_average.validNumber;
    statistics_average.con /= statistics_average.validNumber;
    statistics_average.pow /= statistics_average.validNumber;
    statistics_average.dex /= statistics_average.validNumber;
    statistics_average.app /= statistics_average.validNumber;
    statistics_average.siz /= statistics_average.validNumber;
    statistics_average.int /= statistics_average.validNumber;
    statistics_average.edu /= statistics_average.validNumber;
    statistics_average.additional.memoLength /= charasheet.length;
    statistics_average.additional.age.average /= statistics_average.additional.age.validNumber;
    statistics_average.additional.height.average /= statistics_average.additional.height.validNumber;
    statistics_average.additional.sex.maleRate /= statistics_average.additional.sex.validNumber;
    statistics_average.additional.sex.femaleRate /= statistics_average.additional.sex.validNumber;
    statistics_average.additional.sex.otherRate /= statistics_average.additional.sex.validNumber;
  }
  calcStatistics();

  function numberWithPlus(n: number): string {
    if (n > 0) {
      return "+" + Math.round(n * 100)/100;
    } else {
      return (Math.round(n * 100)/100).toString();
    }
  }

  return (
    <div className='outline'>
      <div id="statistics">
        全キャラシ数:{charasheet.length} (かっこ内の数値は期待値との差分です)<br />
        <p>
          平均STR:{Math.round(statistics_average.str * 100) / 100} ({numberWithPlus(statistics_average.str-10.5)})<br />
          平均CON:{Math.round(statistics_average.con * 100) / 100} ({numberWithPlus(statistics_average.con-10.5)})<br />
          平均POW:{Math.round(statistics_average.pow * 100) / 100} ({numberWithPlus(statistics_average.pow-10.5)})<br />
          平均DEX:{Math.round(statistics_average.dex * 100) / 100} ({numberWithPlus(statistics_average.dex-10.5)})<br />
          平均APP:{Math.round(statistics_average.app * 100) / 100} ({numberWithPlus(statistics_average.app-10.5)})<br />
          平均SIZ:{Math.round(statistics_average.siz * 100) / 100} ({numberWithPlus(statistics_average.siz-13.0)})<br />
          平均INT:{Math.round(statistics_average.int * 100) / 100} ({numberWithPlus(statistics_average.int-13.0)})<br />
          平均EDU:{Math.round(statistics_average.edu * 100) / 100} ({numberWithPlus(statistics_average.edu-13.5)})<br />
          (<span title={"無視したキャラシ\n\n" + ignore_list.abilities.join("\n")}>有効キャラシ数:{statistics_average.validNumber}</span>)<br />
          <br />
          平均メモ欄文字数:{Math.round(statistics_average.additional.memoLength * 100) / 100}<br />
          平均年齢:{Math.round(statistics_average.additional.age.average * 100) / 100}歳(<span title={"無視したキャラシ\n\n" + ignore_list.age.join("\n")}>有効キャラシ数:{statistics_average.additional.age.validNumber}</span>)<br />
          平均身長:{Math.round(statistics_average.additional.height.average * 100) / 100}cm(<span title={"無視したキャラシ\n\n" + ignore_list.height.join("\n")}>有効キャラシ数:{statistics_average.additional.height.validNumber}</span>)<br />
          性別割合:<span title={ignore_list.male.join("\n")}>男性 {Math.round(statistics_average.additional.sex.maleRate * 1000) / 10}%</span>/<span title={ignore_list.female.join("\n")}>女性 {Math.round(statistics_average.additional.sex.femaleRate * 1000) / 10}%</span>/<span title={ignore_list.other.join("\n")}>不明 {Math.round(statistics_average.additional.sex.otherRate * 1000) / 10}%</span><br />
        </p>
      </div>
      <hr />
      <div id="sort-filter">
        <Select options={sort_options} defaultValue={{ value: filt_mode.sortBy[0].condition, label: sort_options.find((option) => option.value === filt_mode.sortBy[0].condition)?.label }} isSearchable={true} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.sortBy[0].condition = selected!.value;
          setFiltMode(new_mode);
        }} />
        {filt_mode.sortBy[0].condition === "skill" ? <Select options={skill_list} defaultValue={{ value: filt_mode.sortBy[0].subCondition, label: filt_mode.sortBy[0].subCondition }} isSearchable={true} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.sortBy[0].subCondition = selected!.value;
          setFiltMode(new_mode);
        }} isOptionDisabled={(option) => option.value === ""} /> : <></>}
        を使って
        <Select options={sort_order} defaultValue={{ value: filt_mode.sortBy[0].order, label: sort_order.find((option) => option.value === filt_mode.sortBy[0].order)?.label }} isSearchable={true} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.sortBy[0].order = selected!.value;
          setFiltMode(new_mode);
        }} />
        でソート
        <br />
        <hr />
        <Filters filt_mode={filt_mode} setFiltMode={setFiltMode} />
        <span className='can-click-span' onClick={() => {
          let new_mode: SortAndFilterMode = { ...filt_mode };
          new_mode.filterBy.push({
            condition: "create",
            subCondition: "回避",
            min: 0,
            max: Date.now(),
          });
          setFiltMode(new_mode);
        }}>
          表示条件を追加<CiCirclePlus size={"1.5rem"} style={{ margin: "0.5rem", verticalAlign: "middle" }} />
        </span>
      </div>
      <br />
      <CharaList charasheet={charasheet} mode={filt_mode} />
    </div>
  );
}

function Filters({ filt_mode, setFiltMode }: { filt_mode: SortAndFilterMode, setFiltMode: React.Dispatch<React.SetStateAction<SortAndFilterMode>> }) {
  let filt_list: ReactElement[] = [];
  filt_mode.filterBy.forEach(function (elm, index) {
    let range_max: number =
      (elm.condition === "str" || elm.condition === "con" || elm.condition === "pow" || elm.condition === "dex" || elm.condition === "app" || elm.condition === "siz" || elm.condition === "int") ? 18 :
        (elm.condition === "edu") ? 21 :
          (elm.condition === "height") ? 201 :
            (elm.condition === "skill" || elm.condition === "san") ? 100 :
              (elm.condition === "age") ? 101 :
                (elm.condition === "db") ? 5 :
                  (elm.condition === "create" || elm.condition === "update") ? Date.now() :
                    (elm.condition === "memo") ? 10001 : 1;
    let format: any = {
      to: function (value: number) {
        if (elm.condition === "create" || elm.condition === "update") {
          return (new Date(value)).toLocaleDateString('ja-JP');
        }
        if (elm.condition === "db") {
          const db_list = ["-1d6", "-1d4", "+0", "+1d4", "+1d6", "+1d6以上"];
          if (value > 5) {
            value = 5;
          }
          return db_list[value];
        }
        if (elm.condition === "memo") {
          if (value === 10001) {
            return "10000文字以上";
          }
          else {
            return `${Math.round(value)}文字`;
          }
        }
        if (elm.condition === "age") {
          if (value === 101) {
            return "100歳以上";
          }
          else {
            return `${Math.round(value)}歳`;
          }
        }
        if (elm.condition === "height") {
          if (value === 201) {
            return "200cm以上";
          }
          else {
            return `${Math.round(value)}cm`;
          }
        }
        return Math.round(value);
      }
    }
    filt_list.push(
      <div key={`filt-${index}`}>
        <Select options={filt_options} defaultValue={{ value: elm.condition, label: filt_options.find((option) => option.value === elm.condition)?.label }} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.filterBy[index].condition = selected!.value;
          setFiltMode(new_mode);
        }} />
        {elm.condition === "skill" ? <Select options={skill_list} defaultValue={{ value: elm.subCondition, label: elm.subCondition }} isSearchable={true} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.filterBy[index].subCondition = selected!.value;
          setFiltMode(new_mode);
        }} isOptionDisabled={(option) => option.value === ""} /> : <></>}
        {elm.condition === "notlost" || elm.condition === "lost" || elm.condition === "6th" || elm.condition === "7th" ? <></> :
        <Nouislider range={{ min: ((elm.condition === "create" || elm.condition === "update") ? 1577836800000 : 0), max: range_max }} start={[elm.min, elm.max]} step={1} tooltips={[format, format]} style={{ margin: "1rem 5% 1rem 5%", zIndex: 0 }} onChange={(values) => {
          let new_mode = { ...filt_mode };
          filt_mode.filterBy[index].min = Math.round(values[0]);
          filt_mode.filterBy[index].max = Math.round(values[1]);
          setFiltMode(new_mode);
        }} connect />}
        <span className='can-click-span' onClick={() => {
          let new_mode: SortAndFilterMode = { ...filt_mode };
          new_mode.filterBy.splice(index, 1);
          setFiltMode(new_mode);
        }}>
          この条件を削除<CiCircleMinus size={"1.5rem"} style={{ margin: "0.5rem", verticalAlign: "middle" }} />
        </span>
        <hr />
      </div>
    );
  });
  return (
    <div>
      {filt_list}
    </div>
  );
}

function CharaList({ charasheet, mode }: { charasheet: IacharaSheet, mode: SortAndFilterMode }) {
  function getSkillSum(chara: CharaSheet, skillname: string): number {
    let answer: number = -1;
    chara.data.actionSkills.static.forEach(function (elm) {
      if (elm.name === skillname) {
        answer = (elm.defaultPoint + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
      }
    })
    chara.data.battleSkills.static.forEach(function (elm) {
      if (elm.name === skillname) {
        if (skillname === "回避") {
          answer = ((chara.data.abilities.dex.value + chara.data.abilities.dex.fixedDiff + chara.data.abilities.dex.tmpFixedDiff) * 2 + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
        }
        else answer = (elm.defaultPoint + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
      }
    })
    chara.data.searchSkills.static.forEach(function (elm) {
      if (elm.name === skillname) {
        answer = (elm.defaultPoint + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
      }
    })
    chara.data.knowledgeSkills.static.forEach(function (elm) {
      if (elm.name === skillname) {
        answer = (elm.defaultPoint + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
      }
    })
    chara.data.negotiationSkills.static.forEach(function (elm) {
      if (elm.name === skillname) {
        if (skillname === "母国語") {
          answer = ((chara.data.abilities.edu.value + chara.data.abilities.edu.fixedDiff + chara.data.abilities.edu.tmpFixedDiff) * 5 + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
        }
        else answer = (elm.defaultPoint + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
      }
    })
    return answer;
  }

  function isPassFilt(chara: CharaSheet, filt: { condition: string, subCondition: string | null, min: number, max: number }): boolean {
    switch (filt.condition) {
      case 'create':
        return (Date.parse(chara.createdAt) >= filt.min && Date.parse(chara.createdAt) <= filt.max);
      case 'update':
        return (Date.parse(chara.createdAt) >= filt.min && Date.parse(chara.createdAt) <= filt.max);
      case 'str':
        return ((chara.data.abilities.str.value + chara.data.abilities.str.fixedDiff + chara.data.abilities.str.tmpFixedDiff) >= filt.min && (chara.data.abilities.str.value + chara.data.abilities.str.fixedDiff + chara.data.abilities.str.tmpFixedDiff) <= filt.max);
      case 'con':
        return ((chara.data.abilities.con.value + chara.data.abilities.con.fixedDiff + chara.data.abilities.con.tmpFixedDiff) >= filt.min && (chara.data.abilities.con.value + chara.data.abilities.con.fixedDiff + chara.data.abilities.con.tmpFixedDiff) <= filt.max);
      case 'pow':
        return ((chara.data.abilities.pow.value + chara.data.abilities.pow.fixedDiff + chara.data.abilities.pow.tmpFixedDiff) >= filt.min && (chara.data.abilities.pow.value + chara.data.abilities.pow.fixedDiff + chara.data.abilities.pow.tmpFixedDiff) <= filt.max);
      case 'dex':
        return ((chara.data.abilities.dex.value + chara.data.abilities.dex.fixedDiff + chara.data.abilities.dex.tmpFixedDiff) >= filt.min && (chara.data.abilities.dex.value + chara.data.abilities.dex.fixedDiff + chara.data.abilities.dex.tmpFixedDiff) <= filt.max);
      case 'app':
        return ((chara.data.abilities.app.value + chara.data.abilities.app.fixedDiff + chara.data.abilities.app.tmpFixedDiff) >= filt.min && (chara.data.abilities.app.value + chara.data.abilities.app.fixedDiff + chara.data.abilities.app.tmpFixedDiff) <= filt.max);
      case 'siz':
        return ((chara.data.abilities.siz.value + chara.data.abilities.siz.fixedDiff + chara.data.abilities.siz.tmpFixedDiff) >= filt.min && (chara.data.abilities.siz.value + chara.data.abilities.siz.fixedDiff + chara.data.abilities.siz.tmpFixedDiff) <= filt.max);
      case 'int':
        return ((chara.data.abilities.int.value + chara.data.abilities.int.fixedDiff + chara.data.abilities.int.tmpFixedDiff) >= filt.min && (chara.data.abilities.int.value + chara.data.abilities.int.fixedDiff + chara.data.abilities.int.tmpFixedDiff) <= filt.max);
      case 'edu':
        return ((chara.data.abilities.edu.value + chara.data.abilities.edu.fixedDiff + chara.data.abilities.edu.tmpFixedDiff) >= filt.min && (chara.data.abilities.edu.value + chara.data.abilities.edu.fixedDiff + chara.data.abilities.edu.tmpFixedDiff) <= filt.max);
      case 'san':
        return (chara.data.abilities.sanCurrent >= filt.min && chara.data.abilities.sanCurrent <= filt.max);
      case 'db':
        const db_list = [[2, 12], [13, 16], [17, 24], [25, 32], [33, 40], [41, Infinity]];
        if (filt.min > 5) filt.min = 5;
        if (filt.max > 5) filt.max = 5;
        return ((chara.data.abilities.str.value + chara.data.abilities.str.fixedDiff + chara.data.abilities.str.tmpFixedDiff) + (chara.data.abilities.siz.value + chara.data.abilities.siz.fixedDiff + chara.data.abilities.siz.tmpFixedDiff) >= db_list[filt.min][0] && (chara.data.abilities.str.value + chara.data.abilities.str.fixedDiff + chara.data.abilities.str.tmpFixedDiff) + (chara.data.abilities.siz.value + chara.data.abilities.siz.fixedDiff + chara.data.abilities.siz.tmpFixedDiff) <= db_list[filt.max][1]);
      case 'memo':
        return (chara.data.memo.length >= filt.min && (chara.data.memo.length <= filt.max || filt.max === 10001))
      case 'age':
        if (isNaN(parseInt(chara.data.profile.age))) return false;
        return (parseInt(chara.data.profile.age) >= filt.min && (parseInt(chara.data.profile.age) <= filt.max || filt.max === 101));
      case 'height':
        if (isNaN(parseInt(chara.data.profile.height))) return false;
        return (parseInt(chara.data.profile.height) >= filt.min && (parseInt(chara.data.profile.height) <= filt.max || filt.max === 201));
      case 'skill':
        if (filt.subCondition === null || filt.subCondition === undefined) {
          return true;
        }
        let skillsum = getSkillSum(chara, filt.subCondition);
        return (skillsum >= filt.min && skillsum <= filt.max);
      case 'notlost':
        return !chara.data.profile.isLost;
      case 'lost':
        return chara.data.profile.isLost;
      case '6th':
        return (chara.data.version === "6th");
      case '7th':
        return (chara.data.version === "7th");
      default:
        return true;
    }
  }

  function getCompareNum(chara: CharaSheet, condition: string, subCondition?: string): string {
    switch (condition) {
      case 'create':
        return new Date(chara.createdAt).toLocaleString("ja-JP");
      case 'update':
        return new Date(chara.updatedAt).toLocaleString("ja-JP");
      case 'str':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.str.value + chara.data.abilities.str.fixedDiff + chara.data.abilities.str.tmpFixedDiff).toString();
      case 'con':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.con.value + chara.data.abilities.con.fixedDiff + chara.data.abilities.con.tmpFixedDiff).toString();
      case 'pow':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.pow.value + chara.data.abilities.pow.fixedDiff + chara.data.abilities.pow.tmpFixedDiff).toString();
      case 'dex':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.dex.value + chara.data.abilities.dex.fixedDiff + chara.data.abilities.dex.tmpFixedDiff).toString();
      case 'app':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.app.value + chara.data.abilities.app.fixedDiff + chara.data.abilities.app.tmpFixedDiff).toString();
      case 'siz':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.siz.value + chara.data.abilities.siz.fixedDiff + chara.data.abilities.siz.tmpFixedDiff).toString();
      case 'int':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.int.value + chara.data.abilities.int.fixedDiff + chara.data.abilities.int.tmpFixedDiff).toString();
      case 'edu':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return (chara.data.abilities.edu.value + chara.data.abilities.edu.fixedDiff + chara.data.abilities.edu.tmpFixedDiff).toString();
      case 'san':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        return chara.data.abilities.sanCurrent.toString();
      case 'db':
        if (chara.data.abilities.sanCurrent === -1) {
          return "不明";
        }
        let strsiz = (chara.data.abilities.str.value + chara.data.abilities.str.fixedDiff + chara.data.abilities.str.tmpFixedDiff) + (chara.data.abilities.siz.value + chara.data.abilities.siz.fixedDiff + chara.data.abilities.siz.tmpFixedDiff);
        let result = "不明";
        if ((2 <= strsiz) && (strsiz <= 12)) {
          result = "-1D6";
        }
        else if ((13 <= strsiz) && (strsiz <= 16)) {
          result = "-1D4";
        }
        else if ((17 <= strsiz) && (strsiz <= 24)) {
          result = "+0";
        }
        else if ((25 <= strsiz) && (strsiz <= 32)) {
          result = "+1D4";
        }
        else if ((33 <= strsiz) && (strsiz <= 40)) {
          result = "+1D6";
        }
        else if ((41 <= strsiz) && (strsiz <= 56)) {
          result = "+2D6";
        }
        else {
          result = `+${Math.floor((strsiz - 57) / 16) + 3}D6`;
        }
        return result;
      case 'memo':
        return chara.data.memo.length.toString() + "文字";
      case 'age':
        if (isNaN(parseInt(chara.data.profile.age))) return "不明";
        return parseInt(chara.data.profile.age) + "歳";
      case 'height':
        if (isNaN(parseInt(chara.data.profile.height))) return "不明";
        return parseInt(chara.data.profile.height) + "cm";
      case 'skill':
        if (chara.data.abilities.sanCurrent === -1 || subCondition === null || subCondition === undefined) {
          return "不明";
        }
        return getSkillSum(chara, subCondition).toString() + "%";
      default:
        return "不明";
    }
  }

  const sortAndFiltered = useMemo<ReactElement[]>(function (): ReactElement[] {
    let chara_rank = 1;
    let chara_index = 1;
    const charalist: ReactElement[] = [];
    mode.sortBy.sort((a, b) => {
      return b.priority - a.priority;
    });
    mode.sortBy.forEach((sortby) => {
      const order = (sortby.order === 'ascend' ? 1 : -1);
      switch (sortby.condition) {
        case 'create':
          charasheet.sort((a, b) => { return order * (Date.parse(a.createdAt) - Date.parse(b.createdAt)) });
          break;
        case 'update':
          charasheet.sort((a, b) => { return order * (Date.parse(a.updatedAt) - Date.parse(b.updatedAt)) });
          break;
        case 'str':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.str.value + a.data.abilities.str.fixedDiff + a.data.abilities.str.tmpFixedDiff) - (b.data.abilities.str.value + b.data.abilities.str.fixedDiff + b.data.abilities.str.tmpFixedDiff));
          });
          break;
        case 'con':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.con.value + a.data.abilities.con.fixedDiff + a.data.abilities.con.tmpFixedDiff) - (b.data.abilities.con.value + b.data.abilities.con.fixedDiff + b.data.abilities.con.tmpFixedDiff));
          });
          break;
        case 'pow':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.pow.value + a.data.abilities.pow.fixedDiff + a.data.abilities.pow.tmpFixedDiff) - (b.data.abilities.pow.value + b.data.abilities.pow.fixedDiff + b.data.abilities.pow.tmpFixedDiff));
          });
          break;
        case 'dex':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.dex.value + a.data.abilities.dex.fixedDiff + a.data.abilities.dex.tmpFixedDiff) - (b.data.abilities.dex.value + b.data.abilities.dex.fixedDiff + b.data.abilities.dex.tmpFixedDiff));
          });
          break;
        case 'app':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.app.value + a.data.abilities.app.fixedDiff + a.data.abilities.app.tmpFixedDiff) - (b.data.abilities.app.value + b.data.abilities.app.fixedDiff + b.data.abilities.app.tmpFixedDiff));
          });
          break;
        case 'siz':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.siz.value + a.data.abilities.siz.fixedDiff + a.data.abilities.siz.tmpFixedDiff) - (b.data.abilities.siz.value + b.data.abilities.siz.fixedDiff + b.data.abilities.siz.tmpFixedDiff));
          });
          break;
        case 'int':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.int.value + a.data.abilities.int.fixedDiff + a.data.abilities.int.tmpFixedDiff) - (b.data.abilities.int.value + b.data.abilities.int.fixedDiff + b.data.abilities.int.tmpFixedDiff));
          });
          break;
        case 'edu':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * ((a.data.abilities.edu.value + a.data.abilities.edu.fixedDiff + a.data.abilities.edu.tmpFixedDiff) - (b.data.abilities.edu.value + b.data.abilities.edu.fixedDiff + b.data.abilities.edu.tmpFixedDiff));
          });
          break;
        case 'san':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.sanCurrent - b.data.abilities.sanCurrent);
          });
          break;
        case 'db':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            const a_db = (a.data.abilities.str.value + a.data.abilities.str.fixedDiff + a.data.abilities.str.tmpFixedDiff) + (a.data.abilities.siz.value + a.data.abilities.siz.fixedDiff + a.data.abilities.siz.tmpFixedDiff);
            const b_db = (b.data.abilities.str.value + b.data.abilities.str.fixedDiff + b.data.abilities.str.tmpFixedDiff) + (b.data.abilities.siz.value + b.data.abilities.siz.fixedDiff + b.data.abilities.siz.tmpFixedDiff);
            return order * (a_db - b_db);
          });
          break;
        case 'memo':
          charasheet.sort((a, b) => {
            return order * (a.data.memo.length - b.data.memo.length);
          });
          break;
        case 'age':
          charasheet.sort((a, b) => {
            if (isNaN(parseInt(a.data.profile.age))) return 1;
            else if (isNaN(parseInt(b.data.profile.age))) return -1;
            return order * (parseInt(a.data.profile.age) - parseInt(b.data.profile.age));
          });
          break;
        case 'height':
          charasheet.sort((a, b) => {
            if (isNaN(parseInt(a.data.profile.height))) return 1;
            else if (isNaN(parseInt(b.data.profile.height))) return -1;
            return order * (parseInt(a.data.profile.height) - parseInt(b.data.profile.height));
          });
          break;
        case 'skill':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            if (sortby.subCondition === null) {
              return 1;
            }
            return order * (getSkillSum(a, sortby.subCondition) - getSkillSum(b, sortby.subCondition));
          });
          break;
      }
    });
    let sns_sentence = `私の自探索者${sort_options.find((elm) => elm.value === mode.sortBy[0].condition)?.label}${mode.sortBy[0].condition === "skill" ? `(${mode.sortBy[0].subCondition})` : ""}ランキングは...%0a%0a`;
    charasheet.forEach(function (chara, index) {
      let is_passed = true;
      mode.filterBy.forEach(function (filt) {
        if (!isPassFilt(chara, filt)) {
          is_passed = false;
        }
      });
      if (is_passed) {
        if (chara_index <= 5) sns_sentence += `${(getCompareNum(chara, mode.sortBy[0].condition, (mode.sortBy[0].subCondition ?? undefined)) === "不明" ? "ランク外" : chara_rank + "位")} ${chara.data.profile.name} (${chara.data.profile.tag}): ${getCompareNum(chara, mode.sortBy[0].condition, (mode.sortBy[0].subCondition ?? undefined))}%0a`
        charalist.push(
          <details key={chara.id}>
            <summary>{(getCompareNum(chara, mode.sortBy[0].condition, (mode.sortBy[0].subCondition ?? undefined)) === "不明" ? "ランク外" : chara_rank + "位")} {chara.data.profile.name}</summary>
            <div>
              タグ: {chara.data.profile.tag}<br />
              {sort_options.find((elm) => elm.value === mode.sortBy[0].condition)?.label}{mode.sortBy[0].condition === "skill" ? `(${mode.sortBy[0].subCondition})` : ""}:{getCompareNum(chara, mode.sortBy[0].condition, (mode.sortBy[0].subCondition ?? undefined))}
              <div className='charasheet-link'>
                <a target="_blank" href={`https://iachara.com/view/${chara.id}`} rel="noopener noreferrer">いあきゃらで閲覧</a>
              </div>
            </div>
          </details>
        );
        if (index < charasheet.length - 1 && getCompareNum(chara, mode.sortBy[0].condition, (mode.sortBy[0].subCondition ?? undefined)) !== getCompareNum(charasheet[index + 1], mode.sortBy[0].condition, (mode.sortBy[0].subCondition ?? undefined))) {
          chara_rank++;
        }
        chara_index++;
      }
    });
    charalist.unshift((
      <a key="share" href={`http://twitter.com/share?url=https://www.godofmegane.com/iachara-statistics/&text=${sns_sentence}`} target="_blank" rel="noopener noreferrer">
        ランキングを投稿<FaXTwitter />
      </a>
    ));
    return charalist;
  }, [charasheet, mode]);

  return (
    <div>
      {sortAndFiltered}
    </div>
  );
}

export default App;
