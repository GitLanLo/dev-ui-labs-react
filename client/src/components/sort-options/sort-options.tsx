import { useState } from 'react';
import { SortOffersType } from '../../const';
import { SortType } from '../../types/sort';

type SortOptionsProps = {
  currentSortType: SortType;
  onChange: (sortType: SortType) => void;
};

const sortOptions: SortType[] = [
  SortOffersType.Popular,
  SortOffersType.PriceLowToHigh,
  SortOffersType.PriceHighToLow,
  SortOffersType.TopRatedFirst,
];

function SortOptions({ currentSortType, onChange }: SortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: SortType) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by&nbsp;</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {currentSortType}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="/img/sprite.svg#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpen ? 'places__options--opened' : ''
        }`.trim()}
      >
        {sortOptions.map((option) => (
          <li
            key={option}
            className={`places__option ${
              option === currentSortType ? 'places__option--active' : ''
            }`.trim()}
            tabIndex={0}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}

export { SortOptions };
