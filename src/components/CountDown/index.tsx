import { Statistic } from 'antd';
import { ReactComponent as Hourglass } from 'assets/images/Hourglass.svg';
import styles from './index.module.css';
import moment from 'moment';
import { memo, useEffect, useReducer, useRef, useState } from 'react';

const { Countdown } = Statistic;

export interface ICountDown {
  deadLine: number;
  irregular?: boolean;
  onCountdownFinish?: () => void;
}
const CountDown = ({ deadLine, onCountdownFinish, irregular = false }: ICountDown) => {
  // Component state
  const [showCountDown, setShowCountDown] = useState(true);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const timer = useRef<NodeJS.Timer>();

  // Calculated states
  const diffDay = moment(deadLine).diff(moment(), 'days');
  const overOneDay = diffDay > 0;
  const overDay = diffDay > 1;
  const formatMsg = overOneDay ? `DD [${overDay ? 'days' : 'day'} left]` : 'HH:mm:ss';

  useEffect(() => {
    timer.current = setInterval(() => {
      forceUpdate();
    }, 1000);
    return () => clearInterval(timer.current);
  }, [deadLine]);

  useEffect(() => {
    if (!overOneDay) {
      clearInterval(timer.current);
    }
  });

  const onFinish = () => {
    setShowCountDown(false);
    onCountdownFinish && onCountdownFinish();
  };

  if (!showCountDown) {
    return null;
  }

  return (
    <Countdown
      className={`${styles['timer-count-down']} ${irregular && styles['timer-count-down-irregular']} `}
      prefix={<Hourglass />}
      value={deadLine}
      format={formatMsg}
      onFinish={onFinish}
    />
  );
};

export default memo(CountDown);
