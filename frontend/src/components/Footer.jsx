const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8 border-t-2 border-green-700">
      <p>
        &copy; {new Date().getFullYear()} Developed by{" "}
        <a 
          href="https://www.linkedin.com/in/rodrigo-gesser-b5277a11a/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-400 hover:underline"
        >
          Rodrigo Gesser
        </a>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;