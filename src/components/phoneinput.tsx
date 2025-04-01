import { useState } from "react";

interface PhoneInputProps {
  onChange: (value: string) => void; 
  value?: string;
  name?: string;
  placeholder?: string;
  className?: string;
}

const countryCodes = [
  { code: "+244", name: "Angola", flag: "https://flagcdn.com/w40/ao.png" },
  { code: "+1", name: "United States", flag: "https://flagcdn.com/w40/us.png" },
  { code: "+44", name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "+55", name: "Brazil", flag: "https://flagcdn.com/w40/br.png" },
  { code: "+33", name: "France", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "+49", name: "Germany", flag: "https://flagcdn.com/w40/de.png" },
  { code: "+351", name: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
];

const PhoneInput: React.FC<PhoneInputProps> = ({
  onChange,
  value,
  name,
  placeholder = "Phone number",
  className = "",
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, ""); 
    const formattedValue = `${selectedCountry.code} ${phoneNumber}`;
    onChange(formattedValue); 
};

  return (
    <div className={`relative mb-6 ${className}`}>
      <div className="flex items-center border border-gray-700 rounded-md bg-gray-900 px-3 py-2">

        <img
          src={selectedCountry.flag}
          alt={selectedCountry.name}
          className="w-6 h-4 object-cover rounded-sm mr-2"
        />

        <select
          className="bg-transparent text-gray-300 text-sm outline-none"
          value={selectedCountry.code}
          onChange={(e) => {
            const country = countryCodes.find((c) => c.code === e.target.value);
            if (country) {
              setSelectedCountry(country);
              onChange(`${country.code} ${value?.replace(selectedCountry.code, "").trim() || ""}`);
            }
          }}
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.code}
            </option>
          ))}
        </select>

        <input
          type="text"
          name={name}
          value={value?.replace(selectedCountry.code, "").trim() || ""}
          onChange={handlePhoneChange}
          className="bg-transparent text-gray-100 flex-1 outline-none px-2"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
