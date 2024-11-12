import { useState } from 'react';

export const useLotusSearch = () => {
  const [search, setSearch] = useState('');

  const onChangeSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  const onClickSearchLotus = (searchValue: string) => {
    if (!searchValue) return;

    // TODO: queryClient.invalidateQueries 새로운 검색어로 검색 수행
    console.log('검색!: ', searchValue);
  };

  const onSearchInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, searchValue: string) => {
    if (event.key === 'Enter') onClickSearchLotus(searchValue);
  };

  return {
    search,
    onChangeSearch,
    onClickSearchLotus,
    onSearchInputKeyDown
  };
};
