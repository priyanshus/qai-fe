
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 text-center text-sm shadow-inner">
      <div className="container mx-auto flex justify-center items-center">
        <div className="bg-yellow-500 rounded-sm p-1 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p>Demo version – internal use only | © {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;
