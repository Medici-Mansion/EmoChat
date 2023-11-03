import { randomInt } from 'crypto';

export const generateNickname = () => {
  const determiners = [
    '예쁜',
    '화난',
    '귀여운',
    '배고픈',
    '철학적인',
    '도전적인',
    '슬픈',
    '푸른',
    '하품하는',
    '물놀이하는',
    '밝은',
  ];
  const animals = [
    '호랑이',
    '비버',
    '강아지',
    '부엉이',
    '여우',
    '치타',
    '문어',
    '고양이',
    '미어캣',
    '다람쥐',
    '하마',
    '물개',
  ];

  return `${determiners[randomInt(determiners.length)]} ${
    animals[randomInt(determiners.length)]
  }`;
};
