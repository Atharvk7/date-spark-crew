import { faker } from '@faker-js/faker';

const generateProfiles = () => {
  const profiles = [];
  const matchmakers = ['matchmaker1', 'matchmaker2', 'matchmaker3'];
  const genders = ['Male', 'Female'];
  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
  const maritalStatuses = [
    'Never Married', 'Never Married', 'Never Married', 'Never Married', 'Never Married', 
    'Divorced', 'Widowed'
  ];
  const preferences = ['Yes', 'No', 'Maybe'];
  const degrees = [
    'Bachelor of Technology', 'Bachelor of Engineering', 'Bachelor of Medicine',
    'Bachelor of Commerce', 'Bachelor of Arts', 'Bachelor of Science',
    'Master of Technology', 'Master of Business Administration', 'Master of Science',
    'Doctor of Philosophy', 'Chartered Accountant', 'Company Secretary'
  ];
  const designations = [
    'Software Engineer', 'Senior Developer', 'Project Manager', 'Business Analyst',
    'Data Scientist', 'Product Manager', 'Marketing Manager', 'Sales Executive',
    'Human Resources Manager', 'Financial Analyst', 'Accountant', 'Teacher',
    'Doctor', 'Nurse', 'Lawyer', 'Architect', 'Civil Engineer', 'Mechanical Engineer',
    'Research Scientist', 'Consultant', 'Entrepreneur', 'Artist', 'Writer'
  ];
  const companies = [
    'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant', 'Accenture',
    'IBM', 'Microsoft', 'Google', 'Amazon', 'HDFC Bank', 'ICICI Bank', 'SBI',
    'Apollo Hospitals', 'Fortis Healthcare', 'L&T', 'Reliance', 'Tata Motors',
    'Startup Company', 'Government Organization', 'Educational Institution'
  ];
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
    'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Varanasi',
    'Amritsar', 'Chandigarh', 'Dehradun', 'Shimla', 'Goa', 'Kochi', 'Trivandrum'
  ];
  const colleges = [
    'Mumbai University', 'Delhi University', 'Bangalore University', 'Anna University',
    'Osmania University', 'Pune University', 'Calcutta University', 'Gujarat University',
    'Rajasthan University', 'Lucknow University', 'Kanpur University', 'Nagpur University',
    'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
    'BITS Pilani', 'Manipal University', 'Amity University', 'Symbiosis University'
  ];
  const personalityTraits = [
    'Ambitious', 'Creative', 'Analytical', 'Social', 'Introverted', 'Extroverted',
    'Patient', 'Impatient', 'Optimistic', 'Pessimistic', 'Logical', 'Emotional',
    'Adventurous', 'Cautious', 'Independent', 'Dependent', 'Confident', 'Humble',
    'Organized', 'Spontaneous', 'Traditional', 'Modern', 'Family-oriented', 'Career-focused'
  ];
  const hobbies = [
    'Reading', 'Writing', 'Cooking', 'Baking', 'Travel', 'Photography', 'Painting',
    'Music', 'Dance', 'Sports', 'Fitness', 'Gaming', 'Coding', 'Gardening',
    'Hiking', 'Swimming', 'Cycling', 'Yoga', 'Meditation', 'Collecting', 'DIY'
  ];
  const familyValues = [
    'Traditional Indian family values with modern outlook',
    'Progressive family with emphasis on education',
    'Cultural family with emphasis on arts and literature',
    'Business-oriented family with strong work ethic',
    'Religious family with spiritual values',
    'Modern family with liberal outlook',
    'Conservative family with traditional values',
    'Academic family with intellectual pursuits'
  ];
  const careerGoals = [
    'Senior management position in current sector',
    'Entrepreneur and business owner',
    'Technology consultant or expert',
    'Leading professional in specialized field',
    'Academic researcher or professor',
    'Creative professional or artist',
    'Healthcare leader or specialist',
    'Government or public service leader'
  ];
  const lifestylePreferences = [
    'Balanced work-life, enjoys cultural activities',
    'Tech-focused lifestyle, fitness enthusiast',
    'Active lifestyle, loves outdoor activities',
    'Professional lifestyle, values family time',
    'Creative lifestyle, enjoys cultural activities',
    'Fast-paced lifestyle, career-driven',
    'Relaxed lifestyle, values personal time',
    'Social lifestyle, enjoys networking and events'
  ];

  while (profiles.length < 100) {
    const gender = faker.helpers.arrayElement(genders);
    const dateOfBirth = faker.date.between({ from: '1975-01-01', to: '2000-12-31' });
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    
    // Ensure age is between 25-50 for realistic matchmaking
    if (age < 25 || age > 50) {
      continue;
    }

    const id = (profiles.length + 1).toString();

    const profile = {
      id,
      firstName: faker.person.firstName(gender === 'Male' ? 'male' : 'female'),
      lastName: faker.person.lastName(),
      gender,
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
      country: 'India',
      city: faker.helpers.arrayElement(cities),
      height: gender === 'Male' ? faker.number.int({ min: 165, max: 190 }) : faker.number.int({ min: 150, max: 175 }),
      email: faker.internet.email(),
      phoneNumber: `+91-${faker.string.numeric(5)}-${faker.string.numeric(5)}`,
      undergraduateCollege: faker.helpers.arrayElement(colleges),
      degree: faker.helpers.arrayElement(degrees),
      income: faker.number.int({ min: 500000, max: 3000000 }),
      currentCompany: faker.helpers.arrayElement(companies),
      designation: faker.helpers.arrayElement(designations),
      maritalStatus: faker.helpers.arrayElement(maritalStatuses),
      languagesKnown: faker.helpers.arrayElements(['English', 'Hindi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi'], { min: 2, max: 4 }),
      siblings: faker.number.int({ min: 0, max: 4 }),
      caste: faker.helpers.arrayElement(['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Singh', 'Kumar', 'Nair', 'Iyer', 'Menon']),
      religion: faker.helpers.arrayElement(religions),
      wantKids: faker.helpers.arrayElement(preferences),
      openToRelocate: faker.helpers.arrayElement(preferences),
      openToPets: faker.helpers.arrayElement(preferences),
      matchmakerId: faker.helpers.arrayElement(matchmakers),
      personalityTraits: faker.helpers.arrayElements(personalityTraits, { min: 3, max: 6 }),
      hobbies: faker.helpers.arrayElements(hobbies, { min: 2, max: 5 }),
      familyValues: faker.helpers.arrayElement(familyValues),
      careerGoals: faker.helpers.arrayElement(careerGoals),
      lifestylePreferences: faker.helpers.arrayElement(lifestylePreferences)
    };

    profiles.push(profile);
  }

  return profiles;
};

// Generate and output profiles
const profiles = generateProfiles();
console.log(JSON.stringify(profiles, null, 2));
console.log(`\nGenerated ${profiles.length} profiles`);
