import { LotusAuthor, LotusCreateDate, LotusLink, LotusLogo, LotusProvider, LotusTagList, LotusTitle } from './Lotus';

export const Lotus = Object.assign(LotusProvider, {
  Title: LotusTitle,
  Author: LotusAuthor,
  Logo: LotusLogo,
  CreateDate: LotusCreateDate,
  TagList: LotusTagList,
  Link: LotusLink
});

export * from './query';
