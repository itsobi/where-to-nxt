interface CountryDropdownProps {
  className: string;
}

export function CountryDropdown({ className }: CountryDropdownProps) {
  return (
    <div className={className}>
      <div className="flex justify-center">Country Dropdown</div>
    </div>
  );
}
