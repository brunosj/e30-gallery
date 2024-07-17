import React from 'react'

type DotButtonPropType = {
  selected: boolean
  onClick: () => void
}

export const DotButton: React.FC<DotButtonPropType> = props => {
  const { selected, onClick } = props

  return (
    <button
      className={'embla__dot'.concat(selected ? ' embla__dot--selected' : '')}
      type="button"
      onClick={onClick}
    />
  )
}

// type PrevNextButtonPropType = {
//   enabled: boolean;
//   onClick: () => void;
// };

// export const PrevButton: React.FC<PrevNextButtonPropType> = (props) => {
//   const { enabled, onClick } = props;

//   return (
//     <button
//       className='embla__button embla__button--prev group'
//       onClick={onClick}
//       disabled={!enabled}
//       aria-label='Previous'
//     >
//       <BsArrowRight className='w-[1.2rem] h-[1.2rem] mr-1 fill-white rotate-180 group-hover:fill-[#6d39ff] duration-150' />
//     </button>
//   );
// };

// export const NextButton: React.FC<PrevNextButtonPropType> = (props) => {
//   const { enabled, onClick } = props;

//   return (
//     <button
//       className='embla__button embla__button--next group'
//       onClick={onClick}
//       disabled={!enabled}
//       aria-label='Next'
//     >
//       <BsArrowRight className='w-[1.2rem] h-[1.2rem] fill-white ml-1 group-hover:fill-[#6d39ff] duration-150' />
//     </button>
//   );
// };
