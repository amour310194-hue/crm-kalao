const CommonFooter = () => {
  return (
    <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
      <p className="mb-md-0 mb-1">
        Copyright © {new Date().getFullYear()}
        <span className="ms-1">Groupe Kalao</span>
      </p>
    </footer>
  );
};

export default CommonFooter;
