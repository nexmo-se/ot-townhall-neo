// @flow
import React from 'react';
import LayoutManager from 'utils/layout-manager';
import clsx from 'clsx';
import lodash from 'lodash';

import useStyles from './styles';
import useSession from 'hooks/session';

interface ILayoutContainerComposer {
  id: string;
  size: 'big' | 'small' | 'screen';
  hidden?: boolean;
  children?: any;
}

function LayoutContainerComposer({
  id,
  size = 'big',
  hidden,
  children
}: ILayoutContainerComposer) {
  const { streams, session } = useSession();
  const mStyles = useStyles();
  const containerRef = React.useRef();
  const layoutRef = React.useRef<any>();

  return (
    <div
      id={id}
      ref={containerRef}
      className={clsx({
        [mStyles.container]: true,
        [mStyles.big]: size === 'big',
        [mStyles.hidden]: hidden,
        [mStyles.screen]: size === 'screen',
        [mStyles.screenContainer]: true
      })}
    >
      <div id="cameraContainer" className={mStyles.cameraContainer}></div>
      {children}
    </div>
  );
}
export default LayoutContainerComposer;
