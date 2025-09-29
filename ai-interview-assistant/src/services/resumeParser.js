// MOCK: In a real app, use libraries like pdf-parse (on a server) to extract text.
// This function simulates extracting info from a resume file.
export const parseResume = async (file) => {
  console.log('Parsing resume:', file.name);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock extracted data. In reality, you'd use regex or an NLP model on the extracted text.
  // This mock intentionally leaves some fields blank to test the chatbot's info collection.
  if (file.name.includes("full")) {
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    };
  } else {
    return {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '', // Intentionally missing to trigger chatbot question [cite: 17]
    };
  }
};