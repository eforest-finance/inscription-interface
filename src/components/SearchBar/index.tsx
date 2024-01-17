import SearchSelect from 'components/SearchSelect';
import { memo } from 'react';

const SearchBar = memo(() => {
  return (
    <div className="flex flex-col items-center w-full z-[11]">
      <SearchSelect isSwitchStyle={true} />
    </div>
  );
});
export { SearchBar };
