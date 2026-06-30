// @flow
import GuideImage from "assets/img/guide.png";
import React from "react";
import clsx from "clsx";
import useStyles from "./styles";

type GuideProps = { visible: boolean, onCloseClick: Function }
function Guide({ visible = false, onCloseClick }: GuideProps){
  const mStyles = useStyles();

  return (
    <div 
      className={clsx({
        [mStyles.guideContainer]: true,
        [mStyles.guideHidden]: !visible
      })}
    >
      <div className={mStyles.guideContent}>
        <img src={GuideImage} alt="Guide" className={mStyles.guideImage} />
        <div>
          <p className="Vlt-white">
            For Chrome users, please follow the steps below to mute site. 
            <ol>
              <li>1. Right click on the browser tab</li>
              <li>2. Click ‘Mute Site’</li>
              <li>3. Proceed to access remote interpretation as per instructions given earlier in the Convo Virtual environment. Here’s the same Guide. </li>
            </ol>
          </p>

          <p className="Vlt-white">
            如果您使用Chrome浏览器，可根据以下步骤静音页面
            <ol>
              <li>1. 右键单击标签页</li>
              <li>2. 点击“将这个网站静音”</li>
              <li>3. 根据Convo峰会的介绍，开启音频翻译（详情请见用户操作指南） </li>
            </ol>
          </p>

          <p className="Vlt-white">
            Chrome 사용자의 경우 다음 단계에 따라 사이트 음소거를 하십시오
            <ol>
              <li>1. 브라우저 탭에서 마우스 오른쪽 단추를 누릅니다.</li>
              <li>2. “Mute Site(사이트 숨기기)”를 선택 하십시오.</li>
              <li>3. Convo 온라인 컨퍼런스 행사 동안 사전에 제공된 이용방법을 통해 원격 통역 서비스를 이용하시기 바랍니다. 다음 가이드를 참고하시기 바랍니다.</li>
            </ol>
          </p>

          <p className="Vlt-white">
            Chromeユーザーは、以下の手順に従ってサイトを消音（ミュート）にしてください。 
            <ol>
              <li>1. ブラウザのタブを右クリック</li>
              <li>2. サイトをミュート”をクリック</li>
              <li>3. Convo Virtual環境での音声同時通訳利用方法に従ってアクセスします。ガイドはこちらから。</li>
            </ol>
          </p>

          <button 
            type="button"
            onClick={onCloseClick} 
            className="Vlt-btn Vlt-btn--white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
export default Guide;