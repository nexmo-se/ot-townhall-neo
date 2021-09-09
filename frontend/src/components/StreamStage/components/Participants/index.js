import styles from "./Participants.module.css";

import lodash from "lodash";
import clsx from "clsx";
import { cloneElement } from "react";

import { useResizeDetector } from 'react-resize-detector';
import { useEffect, useState, useCallback } from "react";
import { useLayout } from "../../hooks/layout";

const ASPECT_RATIO = (4/3);

function Participants ({ children }) {
  const [childWidth, setChildWidth] = useState(0);
  const [childHeight, setChildHeight] = useState(0);
  const [maxColumn, setMaxColumn] = useState(1);
  const { layout, participantGap } = useLayout();
  const { width, height, ref } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 500
  });

  /**
   * Getting on maximum number of column that can fit everyone in the screen
   * @param {} children 
   * @param {*} numCols 
   * @returns 
   */
  const getMaxColumn = useCallback(
    (children, numCols) => {
      if (!children) return 1;

      const arrChildren = lodash([children]).flattenDeep().value();
      if (arrChildren.length === 1) return 1;

      const childWidth = (width / numCols) - participantGap;
      const childHeight = lodash(childWidth / ASPECT_RATIO).toInteger() - participantGap;
      const totalWidth = numCols * childWidth;
      const totalHeight = (arrChildren.length / numCols) * childHeight;

      if (totalWidth < width && totalHeight < height) {
        return numCols;
      } else {
        return getMaxColumn(arrChildren, numCols + 1);
      }
    },
    [participantGap, width, height]
  )

  /**
   * This will calculate recursively for the childWidth.
   * Do the simulation if the totalWidth and totalHeight is over the provided
   * container, it will reduce the childWidth, so that it can fit in the screen.
   */
  const getChildSize = useCallback(
    (children, childWidth) => {
      const arrChildren = lodash([children]).flattenDeep().value();
      const childHeight = lodash(childWidth / ASPECT_RATIO).ceil() - participantGap;
      const numCols = lodash(width / childWidth).round();
      const totalHorMargin = (numCols * participantGap) - participantGap;
      const totalVerMargin = (lodash(arrChildren.length / numCols).ceil() * participantGap) - participantGap;
      const totalHeight = (lodash(arrChildren.length / numCols).ceil() * childHeight) + totalVerMargin;
      const totalWidth = (numCols * childWidth) + totalHorMargin;

      if (totalHeight > height || totalWidth > width) {
        return getChildSize(children, childWidth - 4)
      } else {
        return [childWidth, childHeight, numCols];
      }      
    },
    [participantGap, width, height]
  )

  const calculateMargin = useCallback(
    (position) => {
      if (position >= 1) return participantGap * position;
      else return 0;
    },
    [participantGap]
  )

  /**
   * It will help to center the video in the screen.
   */
  const calculateStartingPoint = useCallback(
    () => {
      const arrChildren = lodash([children]).flattenDeep().value();
      const totalHorMargin = (maxColumn * participantGap) - participantGap;
      const totalVerMargin = (lodash(arrChildren.length / maxColumn).ceil() * participantGap) - participantGap;
      const totalWidth = (maxColumn * childWidth) + totalHorMargin;
      const totalHeight = (lodash(arrChildren.length / maxColumn).ceil() * childHeight) + totalVerMargin;

      const deltaWidth = width - totalWidth;
      const deltaHeight = height - totalHeight;
      const startX = deltaWidth / 2;
      const startY = deltaHeight / 2;

      return [startX, startY];
    },
    [width, height, childHeight, childWidth, children, maxColumn, participantGap]
  )

  const renderChildren = useCallback(
    () => {
      const arrChildren = lodash([children]).flattenDeep().value();
      const [startX, startY] = calculateStartingPoint();
      const newChildren = arrChildren.map(
        (child, index) => {
          const xPosition = index % maxColumn;
          const yPosition = lodash.floor(index / maxColumn, 0);

          const leftPosition = (startX + (xPosition * childWidth) + calculateMargin(xPosition));
          const topPosition = startY + (yPosition * childHeight) + calculateMargin(yPosition)
          const key = `streams_${index}`
          const style = {
            width: lodash(childWidth).isNaN()? 0: childWidth,
            height: lodash(childHeight).isNaN()? 0: childHeight,
            position: "absolute",
            left: lodash(leftPosition).isNaN()? 0: leftPosition,
            top: lodash(topPosition).isNaN()? 0: topPosition
          }
          const clonnedChild = cloneElement(child, { key, style })
          return clonnedChild;
        }
      );
      
      return newChildren
    },
    [calculateMargin, calculateStartingPoint, childHeight, childWidth, children, maxColumn]
  );

  useEffect(
    () => {
      const [childWidth, childHeight, maxColumn] = getChildSize(children, width);
      setChildWidth(childWidth);
      setChildHeight(childHeight);
      setMaxColumn(maxColumn);
    },
    [children, getChildSize, width]
  )

  return (
    <section
      ref={ref}
      className={
        clsx({
          [styles.main]: true,
          [styles.dominant]: layout === "dominant"
        })
      }
    >
      {renderChildren()}
    </section>
  );
}

export default Participants;
