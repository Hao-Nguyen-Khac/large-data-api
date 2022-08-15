import fetch, { HeadersInit } from 'node-fetch';

export const makeArrayNumber = (start: number, end: number) => {
  const arrOut = [];

  Array.apply(null, Array(end - start + 1)).map(() => {
    arrOut.push(start);
    start++;
  });
  return arrOut as number[];
};

export const chunkBlock = (data: number[], numberPerBlock: number) => {
  const blocks = [];
  while (data.length > 0) {
    const chunked = data.splice(0, numberPerBlock);
    blocks.push(chunked);
  }
  return blocks as number[][];
};

export const PromisePool = async (
  handler: (index: number[], item: number) => Promise<void>,
  data: number[][],
  concurency: number
) => {
  const iterator = data.entries();
  const workers = new Array(concurency)
    .fill(iterator)
    .map(async (iterator, index, arr) => {
      for (const [index, item] of iterator) {
        await handler(item, index);
      }
    });

  await Promise.all(workers);
};

export const getDataLargeAPI = async (
  startPage: number,
  endPage: number,
  pagePerBlock: number,
  concurency: number,
  url: string,
  options: any
) => {
  const result = [];
  const pageNoBlock = chunkBlock(
    makeArrayNumber(startPage, endPage),
    pagePerBlock
  );
  await PromisePool(
    async (pageNoBlock: number[], index: number) => {
      console.log(pageNoBlock);
      const res: any = await fetch(url + pageNoBlock.join(','), options);
      result[index] = (await res.json()).data;
    },
    pageNoBlock,
    concurency
  );
  return result.flat();
};
