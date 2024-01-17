import TSMTabs from 'components/Tabs';
import Personal from './components/personal';
import Symbol from './components/symbol';
import Token from './components/token';
import useTabs from 'hooks/useTabs';
import { useRedirectHome } from 'hooks/useRedirectHome';

export default function My() {
  useRedirectHome();

  const items = [
    {
      key: '',
      label: 'My SEEDs',
      children: <Symbol />,
    },
    {
      key: 'my-token',
      label: 'My Tokens',
      children: <Token />,
    },
  ];
  const TabProps = useTabs({ hashMode: true, items });
  return (
    <div>
      <Personal />
      <TSMTabs {...TabProps} />
    </div>
  );
}
