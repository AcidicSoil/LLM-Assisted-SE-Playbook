import { forwardRef, InputHTMLAttributes } from 'react';

const SearchInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`p-2 border rounded w-full ${props.className || ''}`}
    />
  );
});

export default SearchInput;
