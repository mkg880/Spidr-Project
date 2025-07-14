import React, { useRef, useState } from "react";
import "./SimpleForm.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SimpleForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [guess, setGuess] = useState("");
  const [pinParts, setPinParts] = useState(["", "", "", ""]);
  const [pin, setPin] = useState("");
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePinChange = (index, value) => {
    if (!/^\d{0,4}$/.test(value)) return;

    const newParts = [...pinParts];
    newParts[index] = value;
    setPinParts(newParts);
    setPin(newParts.join("-"));
    if (value.length === 4 && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && pinParts[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const validatePin = (pin) => {
    return pinParts.every(part => part.length === 4);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setError("");
    setSuccessMessage("");
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number in the format xxx-xxx-xxxx.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    else if (!validatePin(pin)) {
        setError("Please enter a complete 16-digit PIN.");
        return;
    }
    else if (!firstName || !lastName || !phoneNumber || !guess || !pin) {
        setError("Make sure all fields are filled out.");
        return;
    }
    else {
        setSuccessMessage("Your entry has been recorded successfully! Your information has been printed to the console.");
        console.log(`First Name: ${firstName}, Last Name: ${lastName}, Phone: ${phoneNumber}, Email: ${email}, Guess: $${guess}, Pin: ${pin}`);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form-title">Guess the cost!</h1>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            className={isSubmitted && !firstName ? "error" : ""}
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => {
                setIsSubmitted(false);
                setError("");
                setSuccessMessage("");
                setFirstName(e.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            className={isSubmitted && !lastName ? "error" : ""}
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => {
                setLastName(e.target.value);
                setIsSubmitted(false);
                setError("");
                setSuccessMessage("");
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number (xxx-xxx-xxxx)
          </label>
          <input
            className={isSubmitted && !validatePhoneNumber(phoneNumber) ? "error" : ""}
            id="phone"
            type="text"
            placeholder="123-456-7890"
            value={phoneNumber}
            onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                let formatted = value;
                if (value.length >= 3 && value.length < 6) {
                    formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
                } else if (value.length >= 6) {
                    formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
                setIsSubmitted(false);
                setError("");
                setSuccessMessage("");
                setPhoneNumber(formatted);
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address
          </label>
          <input
            className={isSubmitted && !validateEmail(email) ? "error" : ""}
            id="email"
            type="text"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value)
                setIsSubmitted(false);
                setError("");
                setSuccessMessage("");
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="guess">Guess the air fryer's cost (in USD)
          </label>
          <input
            className={isSubmitted && !guess ? "error" : ""}
            id="guess"
            type="text"
            placeholder="$100"
            value={guess ? `$${guess}` : ""}
            onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setGuess(value);
                }
                setIsSubmitted(false);
                setError("");
                setSuccessMessage("");
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pin">Spidr Pin
          </label>
          <div className="pin-group">
            {pinParts.map((part, i) => (
            <React.Fragment key={i}>
                <input
                ref={inputRefs[i]}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                value={part}
                onChange={(e) => {
                    handlePinChange(i, e.target.value);
                    setIsSubmitted(false);
                    setError("");
                    setSuccessMessage("");
                }}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={isSubmitted && part.length !== 4 ? "pin-error" : "pin-box"}
                />
                {i < 3 && <span className="dash">-</span>}
            </React.Fragment>
            ))}
            <span
                className="pin-icon"
                onClick={() => setShowPin(!showPin)}
                role="button"
                aria-label="Toggle PIN visibility"
                >
                {showPin ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <button type="submit">Submit</button>
        {error && <div className="form-error">{error}</div>}
        {successMessage && <div className="form-success">{successMessage}</div>}
      </form>
    </div>
  );
};

export default SimpleForm;
