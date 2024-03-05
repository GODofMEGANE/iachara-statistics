import React, { ReactPropTypes, useState } from 'react';
import './css/App.css';
import { JsxElement, setTextRange } from 'typescript';

function App() {
  const [charasheet, setCharasheet] = useState<IacharaSheet | null>(null);
  return (
    <div>
      <AuthForm setCharasheet={setCharasheet} />
      {
        charasheet !== null ? <Main charasheet={charasheet} /> : <div></div>
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

function Main({ charasheet }: { charasheet: IacharaSheet }) {
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
  let ignore_list: {abilities: string[], age: string[], height: string[], male: string[], female: string[], other: string[]} = {abilities: [], age: [], height: [], male: [], female: [], other: []};
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
    else{
      ignore_list.abilities.push(charasheet[i].data.profile.name);
    }
    if (!isNaN(parseInt(charasheet[i].data.profile.age))) {
      statistics_average.additional.age.average += parseInt(charasheet[i].data.profile.age);
      statistics_average.additional.age.validNumber++;
    }
    else{
      ignore_list.age.push(charasheet[i].data.profile.name);
    }
    if (!isNaN(parseInt(charasheet[i].data.profile.height))) {
      statistics_average.additional.height.average += parseInt(charasheet[i].data.profile.height);
      statistics_average.additional.height.validNumber++;
    }
    else{
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

  return (
    <div className='outline'>
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
        (<span title={"無視したキャラシ\n\n"+ignore_list.abilities.join("\n")}>有効キャラシ数:{statistics_average.validNumber}</span>)
      </p>
      これより下の統計はキャラシに書かれた単位が合っていない場合おかしな結果が表示される場合があります<br />
      <p>
        平均年齢:{Math.round(statistics_average.additional.age.average * 100) / 100}歳(<span title={"無視したキャラシ\n\n"+ignore_list.age.join("\n")}>有効キャラシ数:{statistics_average.additional.age.validNumber}</span>)<br />
        平均身長:{Math.round(statistics_average.additional.height.average * 100) / 100}cm(<span title={"無視したキャラシ\n\n"+ignore_list.height.join("\n")}>有効キャラシ数:{statistics_average.additional.height.validNumber}</span>)<br />
        性別割合:<span title={ignore_list.male.join("\n")}>男性 {Math.round(statistics_average.additional.sex.maleRate * 1000) / 10}%</span>/<span title={ignore_list.female.join("\n")}>女性 {Math.round(statistics_average.additional.sex.femaleRate * 1000) / 10}%</span>/<span title={ignore_list.other.join("\n")}>不明 {Math.round(statistics_average.additional.sex.otherRate * 1000) / 10}%</span><br />
      </p>
      <br />
      <CharaList charasheet={charasheet} />
    </div>
  );
}

function CharaList({ charasheet }: { charasheet: IacharaSheet }) {
  const charalist = [];
  for (let i = 0; i < charasheet.length; i++) {
    charalist.push(<details key={charasheet[i].id}>
      <summary>{charasheet[i].data.profile.name}</summary>
      <div>
        タグ: {charasheet[i].data.profile.tag}
        <div className='charasheet-link'>
          <a target="_blank" href={`https://iachara.com/view/${charasheet[i].id}`} rel="noopener noreferrer">いあきゃらで閲覧</a>
        </div>
      </div>
    </details>);
  }
  return (
    <div>
      {charalist}
    </div>
  );
}

export default App;
