# PowerShell script to generate 200 profiles
$profiles = @()

$matchmakers = @("matchmaker1", "matchmaker2", "matchmaker3")
$genders = @("Male", "Female")
$religions = @("Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain")
$maritalStatuses = @("Never Married", "Divorced", "Widowed")
$preferences = @("Yes", "No", "Maybe")
$degrees = @(
    "Bachelor of Technology", "Bachelor of Engineering", "Bachelor of Medicine",
    "Bachelor of Commerce", "Bachelor of Arts", "Bachelor of Science",
    "Master of Technology", "Master of Business Administration", "Master of Science",
    "Doctor of Philosophy", "Chartered Accountant", "Company Secretary"
)
$designations = @(
    "Software Engineer", "Senior Developer", "Project Manager", "Business Analyst",
    "Data Scientist", "Product Manager", "Marketing Manager", "Sales Executive",
    "Human Resources Manager", "Financial Analyst", "Accountant", "Teacher",
    "Doctor", "Nurse", "Lawyer", "Architect", "Civil Engineer", "Mechanical Engineer",
    "Research Scientist", "Consultant", "Entrepreneur", "Artist", "Writer"
)
$companies = @(
    "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Cognizant", "Accenture",
    "IBM", "Microsoft", "Google", "Amazon", "HDFC Bank", "ICICI Bank", "SBI",
    "Apollo Hospitals", "Fortis Healthcare", "L&T", "Reliance", "Tata Motors",
    "Startup Company", "Government Organization", "Educational Institution"
)
$cities = @(
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata",
    "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
    "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Varanasi",
    "Amritsar", "Chandigarh", "Dehradun", "Shimla", "Goa", "Kochi", "Trivandrum"
)
$colleges = @(
    "Mumbai University", "Delhi University", "Bangalore University", "Anna University",
    "Osmania University", "Pune University", "Calcutta University", "Gujarat University",
    "Rajasthan University", "Lucknow University", "Kanpur University", "Nagpur University",
    "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
    "BITS Pilani", "Manipal University", "Amity University", "Symbiosis University"
)
$personalityTraits = @(
    "Ambitious", "Creative", "Analytical", "Social", "Introverted", "Extroverted",
    "Patient", "Impatient", "Optimistic", "Pessimistic", "Logical", "Emotional",
    "Adventurous", "Cautious", "Independent", "Dependent", "Confident", "Humble",
    "Organized", "Spontaneous", "Traditional", "Modern", "Family-oriented", "Career-focused"
)
$hobbies = @(
    "Reading", "Writing", "Cooking", "Baking", "Travel", "Photography", "Painting",
    "Music", "Dance", "Sports", "Fitness", "Gaming", "Coding", "Gardening",
    "Hiking", "Swimming", "Cycling", "Yoga", "Meditation", "Collecting", "DIY"
)
$familyValues = @(
    "Traditional Indian family values with modern outlook",
    "Progressive family with emphasis on education",
    "Cultural family with emphasis on arts and literature",
    "Business-oriented family with strong work ethic",
    "Religious family with spiritual values",
    "Modern family with liberal outlook",
    "Conservative family with traditional values",
    "Academic family with intellectual pursuits"
)
$careerGoals = @(
    "Senior management position in current sector",
    "Entrepreneur and business owner",
    "Technology consultant or expert",
    "Leading professional in specialized field",
    "Academic researcher or professor",
    "Creative professional or artist",
    "Healthcare leader or specialist",
    "Government or public service leader"
)
$lifestylePreferences = @(
    "Balanced work-life, enjoys cultural activities",
    "Tech-focused lifestyle, fitness enthusiast",
    "Active lifestyle, loves outdoor activities",
    "Professional lifestyle, values family time",
    "Creative lifestyle, enjoys cultural activities",
    "Fast-paced lifestyle, career-driven",
    "Relaxed lifestyle, values personal time",
    "Social lifestyle, enjoys networking and events"
)

$languages = @("English", "Hindi", "Marathi", "Gujarati", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi")
$castes = @("Brahmin", "Kshatriya", "Vaishya", "Shudra", "Patel", "Reddy", "Gupta", "Verma", "Singh", "Kumar", "Nair", "Iyer", "Menon")

$firstNames = @{
    "Male" = @("Arjun", "Rahul", "Vikram", "Aditya", "Karan", "Rohan", "Aryan", "Dev", "Krishna", "Shiva", "Vishal", "Pranav", "Siddharth", "Abhay", "Dhruv", "Ishaan", "Kabir", "Lakshay", "Mohan", "Neeraj", "Om", "Parth", "Qadir", "Ravi", "Sahil", "Tanay", "Uday", "Varun", "Yash", "Zain")
    "Female" = @("Priya", "Anjali", "Meera", "Kavya", "Riya", "Zara", "Aisha", "Diya", "Fatima", "Gauri", "Hina", "Ira", "Jaya", "Kirti", "Lakshmi", "Maya", "Neha", "Ojasvi", "Pooja", "Qurat", "Radha", "Sana", "Tara", "Uma", "Vidya", "Wahida", "Xena", "Yamini", "Zara")
}

$lastNames = @("Sharma", "Patel", "Kumar", "Singh", "Iyer", "Reddy", "Gupta", "Verma", "Joshi", "Malhotra", "Kapoor", "Chopra", "Mehta", "Desai", "Chauhan", "Tiwari", "Yadav", "Kaur", "Khan", "Ali", "Hussain", "Ahmed", "Kumar", "Das", "Banerjee", "Chatterjee", "Mukherjee", "Sen", "Bose", "Ghosh")

for ($i = 1; $i -le 200; $i++) {
    $gender = Get-Random $genders
    $dateOfBirth = Get-Date -Year (Get-Random -Minimum 1975 -Maximum 2001) -Month (Get-Random -Minimum 1 -Maximum 13) -Day (Get-Random -Minimum 1 -Maximum 29)
    $age = (Get-Date).Year - $dateOfBirth.Year
    
    # Ensure age is between 25-50 for realistic matchmaking
    if ($age -lt 25 -or $age -gt 50) { continue }
    
    $profile = @{
        id = $i.ToString()
        firstName = Get-Random $firstNames[$gender]
        lastName = Get-Random $lastNames
        gender = $gender
        dateOfBirth = $dateOfBirth.ToString("yyyy-MM-dd")
        country = "India"
        city = Get-Random $cities
        height = if ($gender -eq "Male") { Get-Random -Minimum 165 -Maximum 191 } else { Get-Random -Minimum 150 -Maximum 176 }
        email = "profile$i@email.com"
        phoneNumber = "+91-" + (Get-Random -Minimum 10000 -Maximum 100000) + "-" + (Get-Random -Minimum 10000 -Maximum 100000)
        undergraduateCollege = Get-Random $colleges
        degree = Get-Random $degrees
        income = Get-Random -Minimum 500000 -Maximum 3000001
        currentCompany = Get-Random $companies
        designation = Get-Random $designations
        maritalStatus = Get-Random $maritalStatuses
        languagesKnown = $languages | Get-Random -Count (Get-Random -Minimum 2 -Maximum 5)
        siblings = Get-Random -Minimum 0 -Maximum 5
        caste = Get-Random $castes
        religion = Get-Random $religions
        wantKids = Get-Random $preferences
        openToRelocate = Get-Random $preferences
        openToPets = Get-Random $preferences
        matchmakerId = Get-Random $matchmakers
        personalityTraits = $personalityTraits | Get-Random -Count (Get-Random -Minimum 3 -Maximum 7)
        hobbies = $hobbies | Get-Random -Count (Get-Random -Minimum 2 -Maximum 6)
        familyValues = Get-Random $familyValues
        careerGoals = Get-Random $careerGoals
        lifestylePreferences = Get-Random $lifestylePreferences
    }
    
    $profiles += $profile
}

# Convert to JSON and save
$json = $profiles | ConvertTo-Json -Depth 10
$json | Out-File -FilePath "src/data/profiles.json" -Encoding UTF8

Write-Host "Generated $($profiles.Count) profiles"
