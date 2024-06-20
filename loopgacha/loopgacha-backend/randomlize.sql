WITH numberedCards AS (
  SELECT
    card.id,
    card.collectionId,
    numbers.num,
    initialInventory,
    appearance,
    ROW_NUMBER() OVER (ORDER BY rand()) AS `rows`
  FROM card
  JOIN numbers ON numbers.num >= 1 AND numbers.num <= card.initialInventory
  WHERE card.collectionId = '03c1d507-6faa-4541-be86-912579541e1e'
  AND deletedAt IS NULL
  AND appearance = 0
  AND status = 'active'
  order by `rows`
), numberedNumbers AS (
  SELECT
  num,
  ROW_NUMBER() OVER (ORDER BY num) AS `rows`
FROM numbers 
WHERE num NOT IN
(SELECT appearance from card WHERE card.collectionId = '03c1d507-6faa-4541-be86-912579541e1e' AND deletedAt IS NULL AND appearance > 0 AND status = 'active')
AND num  > 0
ORDER BY num
)
SELECT
  uuid() as id,
  numberedCards.id as cardId,
  numberedCards.collectionId,
  numberedNumbers.num as `sequence`
FROM numberedCards
JOIN numberedNumbers ON numberedNumbers.rows = numberedCards.rows
UNION
SELECT
  uuid() as id,
  card.id as cardId,
  card.collectionId,
  appearance as `sequence`
FROM card
WHERE card.collectionId = '03c1d507-6faa-4541-be86-912579541e1e'
AND deletedAt IS NULL
AND appearance > 0
AND status = 'active'
ORDER BY `sequence`;

