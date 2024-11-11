import { LotusAuthor, LotusCreateDate, LotusLink, LotusLogo, LotusProvider, LotusTitle } from './Lotus';

export const Lotus = Object.assign(LotusProvider, {
  Title: LotusTitle,
  Author: LotusAuthor,
  Logo: LotusLogo,
  CreateDate: LotusCreateDate,
  Link: LotusLink
});
