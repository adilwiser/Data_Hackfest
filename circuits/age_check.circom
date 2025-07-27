pragma circom 2.0.0;

template AgeCheck() {
    // Private Inputs
    signal input userYear;
    signal input userMonth;
    signal input userDay;

    // Public Inputs
    signal input currentYear;
    signal input currentMonth;
    signal input currentDay;
    signal input ageLimit;

    // Output
    signal output isOverAge;

    var yearDiff = currentYear - userYear;
    var userBirthday = userMonth * 100 + userDay;
    var currentBirthday = currentMonth * 100 + currentDay;

    signal hasBirthdayPassed;
    hasBirthdayPassed <-- (currentBirthday - userBirthday) >= 0;

    var age = yearDiff - (1 - hasBirthdayPassed);

    signal isUnderAge;
    isUnderAge <-- age < ageLimit;

    isOverAge <== 1 - isUnderAge;
}

component main = AgeCheck();