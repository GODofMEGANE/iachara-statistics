import React, { ReactPropTypes, useState, useMemo, ReactElement } from 'react';
import './css/App.css';
import { JsxElement, setTextRange } from 'typescript';
import Select from 'react-select';

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
  { value: "age", label: "年齢" },
  { value: "height", label: "身長" },
  { value: "skill", label: "技能値" },
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
      <input type='text' id='login_id' className='input' value={login_id} onChange={(evt) => { setLoginId(evt.target.value) }} placeholder='ID' onKeyDown={(e) => {
        if (e.key === "Enter") getCharasheet(login_id, password).then((result) => {
          console.log(result);
          setCharasheet(result);
        })
      }} />
      <input type='password' id='password' className='input' value={password} onChange={(evt) => { setPassword(evt.target.value) }} placeholder='PASSWORD' onKeyDown={(e) => {
        if (e.key === "Enter") getCharasheet(login_id, password).then((result) => {
          console.log(result);
          setCharasheet(result);
        })
      }} />
      {auth_status === 'pending' ? (<span style={{ color: 'orange' }}>通信中...</span>) : auth_status === 'success' ? (<span style={{ color: 'green' }}>ログイン成功!</span>) : auth_status === 'failed' ? (<span style={{ color: 'red' }}>IDまたはパスワードが間違っています</span>) : (<span></span>)}
      <br />
      <input type='button' id='submit' value="SUBMIT" onClick={() => {
        getCharasheet(login_id, password).then((result) => {
          console.log(result);
          setCharasheet(result);
        })
      }} />
    </div>
  )
}

function Statistics({ charasheet }: { charasheet: IacharaSheet }) {
  const [filt_mode, setFiltMode] = useState<SortAndFilterMode>({
    sortBy: [{
      priority: 1,
      condition: "create",
      subCondition: null,
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
      if (charasheet[i].data.abilities.str.value > 0 && charasheet[i].data.abilities.con.value > 0 && charasheet[i].data.abilities.pow.value > 0 && charasheet[i].data.abilities.dex.value > 0 && charasheet[i].data.abilities.app.value > 0 && charasheet[i].data.abilities.siz.value > 0 && charasheet[i].data.abilities.int.value > 0 && charasheet[i].data.abilities.edu.value > 0) {
        statistics_average.str += charasheet[i].data.abilities.str.value;
        statistics_average.con += charasheet[i].data.abilities.con.value;
        statistics_average.pow += charasheet[i].data.abilities.pow.value;
        statistics_average.dex += charasheet[i].data.abilities.dex.value;
        statistics_average.app += charasheet[i].data.abilities.app.value;
        statistics_average.siz += charasheet[i].data.abilities.siz.value;
        statistics_average.int += charasheet[i].data.abilities.int.value;
        statistics_average.edu += charasheet[i].data.abilities.edu.value;
        statistics_average.validNumber++;
      }
      else {
        ignore_list.abilities.push(charasheet[i].data.profile.name);
      }
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
    statistics_average.additional.age.average /= statistics_average.additional.age.validNumber;
    statistics_average.additional.height.average /= statistics_average.additional.height.validNumber;
    statistics_average.additional.sex.maleRate /= statistics_average.additional.sex.validNumber;
    statistics_average.additional.sex.femaleRate /= statistics_average.additional.sex.validNumber;
    statistics_average.additional.sex.otherRate /= statistics_average.additional.sex.validNumber;
  }
  calcStatistics();

  return (
    <div className='outline'>
      <div id="statistics">
        全キャラシ数:{charasheet.length}<br />
        <p>
          平均STR:{Math.round(statistics_average.str * 100) / 100}(平均:10.5)<br />
          平均CON:{Math.round(statistics_average.con * 100) / 100}(平均:10.5)<br />
          平均POW:{Math.round(statistics_average.pow * 100) / 100}(平均:10.5)<br />
          平均DEX:{Math.round(statistics_average.dex * 100) / 100}(平均:10.5)<br />
          平均APP:{Math.round(statistics_average.app * 100) / 100}(平均:10.5)<br />
          平均SIZ:{Math.round(statistics_average.siz * 100) / 100}(平均:13.0)<br />
          平均INT:{Math.round(statistics_average.int * 100) / 100}(平均:13.0)<br />
          平均EDU:{Math.round(statistics_average.edu * 100) / 100}(平均:13.5)<br />
          (<span title={"無視したキャラシ\n\n" + ignore_list.abilities.join("\n")}>有効キャラシ数:{statistics_average.validNumber}</span>)
        </p>
        これより下の統計はキャラシに書かれた単位が合っていない場合おかしな結果が表示される場合があります<br />
        <p>
          平均年齢:{Math.round(statistics_average.additional.age.average * 100) / 100}歳(<span title={"無視したキャラシ\n\n" + ignore_list.age.join("\n")}>有効キャラシ数:{statistics_average.additional.age.validNumber}</span>)<br />
          平均身長:{Math.round(statistics_average.additional.height.average * 100) / 100}cm(<span title={"無視したキャラシ\n\n" + ignore_list.height.join("\n")}>有効キャラシ数:{statistics_average.additional.height.validNumber}</span>)<br />
          性別割合:<span title={ignore_list.male.join("\n")}>男性 {Math.round(statistics_average.additional.sex.maleRate * 1000) / 10}%</span>/<span title={ignore_list.female.join("\n")}>女性 {Math.round(statistics_average.additional.sex.femaleRate * 1000) / 10}%</span>/<span title={ignore_list.other.join("\n")}>不明 {Math.round(statistics_average.additional.sex.otherRate * 1000) / 10}%</span><br />
        </p>
      </div>
      <hr />
      <div id="sort-filter">
        <Select options={sort_options} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.sortBy[0].condition = selected!.value;
          setFiltMode(new_mode);
        }} />
        {filt_mode.sortBy[0].condition === "skill" ? <Select options={skill_list} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.sortBy[0].subCondition = selected!.value;
          setFiltMode(new_mode);
        }} /> : <></>}
        を使って
        <Select options={sort_order} onChange={(selected) => {
          let new_mode = { ...filt_mode };
          filt_mode.sortBy[0].order = selected!.value;
          setFiltMode(new_mode);
        }} />
        でソート
      </div>
      <br />
      <CharaList charasheet={charasheet} mode={filt_mode} />
    </div>
  );
}

function CharaList({ charasheet, mode }: { charasheet: IacharaSheet, mode: SortAndFilterMode }) {
  function getSkillSum(chara: CharaSheet, skillname: string): number {
    let answer: number = -1;
    chara.data.actionSkills.static.forEach(function (elm, index) {
      if (elm.name === skillname) {
        answer = (elm.defaultPoint + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
      }
    })
    chara.data.battleSkills.static.forEach(function (elm) {
      if (elm.name === skillname) {
        if (skillname === "回避") {
          answer = (chara.data.abilities.dex.value * 2 + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
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
          answer = (chara.data.abilities.edu.value * 5 + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
        }
        else answer = (elm.defaultPoint + elm.professionPoint + elm.interestPoint + elm.growthPoint + elm.otherPoint);
      }
    })
    return answer;
  }

  function getCompareNum(chara: CharaSheet, condition: string, subCondition?: string): string {
    switch (condition) {
      case 'create':
        return new Date(chara.createdAt).toLocaleString("ja-JP");
      case 'update':
        return new Date(chara.updatedAt).toLocaleString("ja-JP");
      case 'str':
        return chara.data.abilities.str.value.toString();
      case 'con':
        return chara.data.abilities.con.value.toString();
      case 'pow':
        return chara.data.abilities.pow.value.toString();
      case 'dex':
        return chara.data.abilities.dex.value.toString();
      case 'app':
        return chara.data.abilities.app.value.toString();
      case 'siz':
        return chara.data.abilities.siz.value.toString();
      case 'int':
        return chara.data.abilities.int.value.toString();
      case 'edu':
        return chara.data.abilities.edu.value.toString();
      case 'san':
        return chara.data.abilities.sanCurrent.toString();
      case 'age':
        if (isNaN(parseInt(chara.data.profile.age))) return "不明";
        return chara.data.profile.age;
      case 'height':
        if (isNaN(parseInt(chara.data.profile.height))) return "不明";
        return chara.data.profile.height;
      case 'skill':
        if (subCondition === null || subCondition === undefined) {
          return "不明";
        }
        return getSkillSum(chara, subCondition).toString();
      default:
        return "不明";
    }
  }

  const sortAndFiltered = useMemo<ReactElement[]>(function (): ReactElement[] {
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
            return order * (a.data.abilities.str.value - b.data.abilities.str.value)
          });
          break;
        case 'con':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.con.value - b.data.abilities.con.value)
          });
          break;
        case 'pow':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.pow.value - b.data.abilities.pow.value)
          });
          break;
        case 'dex':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.dex.value - b.data.abilities.dex.value)
          });
          break;
        case 'app':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.app.value - b.data.abilities.app.value)
          });
          break;
        case 'siz':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.siz.value - b.data.abilities.siz.value)
          });
          break;
        case 'int':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.int.value - b.data.abilities.int.value)
          });
          break;
        case 'edu':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.edu.value - b.data.abilities.edu.value)
          });
          break;
        case 'san':
          charasheet.sort((a, b) => {
            if (a.data.abilities.sanCurrent < 0) return 1;
            else if (b.data.abilities.sanCurrent < 0) return -1;
            return order * (a.data.abilities.sanCurrent - b.data.abilities.sanCurrent)
          });
          break;
        case 'age':
          charasheet.sort((a, b) => {
            if (isNaN(parseInt(a.data.profile.age))) return 1;
            else if (isNaN(parseInt(b.data.profile.age))) return -1;
            return order * (parseInt(a.data.profile.age) - parseInt(b.data.profile.age))
          });
          break;
        case 'height':
          charasheet.sort((a, b) => {
            if (isNaN(parseInt(a.data.profile.height))) return 1;
            else if (isNaN(parseInt(b.data.profile.height))) return -1;
            return order * (parseInt(a.data.profile.height) - parseInt(b.data.profile.height))
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
    for (let i = 0; i < charasheet.length; i++) {
      charalist.push(<details key={charasheet[i].id}>
        <summary>{i + 1} {charasheet[i].data.profile.name}</summary>
        <div>
          タグ: {charasheet[i].data.profile.tag}<br />
          {sort_options.find((elm) => elm.value === mode.sortBy[0].condition)?.label}{mode.sortBy[0].condition==="skill"?`(${mode.sortBy[0].subCondition})`:""}:{getCompareNum(charasheet[i], mode.sortBy[0].condition, (mode.sortBy[0].subCondition ?? undefined))}
          <div className='charasheet-link'>
            <a target="_blank" href={`https://iachara.com/view/${charasheet[i].id}`} rel="noopener noreferrer">いあきゃらで閲覧</a>
          </div>
        </div>
      </details>);
    }
    return charalist;
  }, [charasheet, mode]);


  return (
    <div>
      {sortAndFiltered}
    </div>
  );
}

export default App;
