import React from 'react';

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
  linkType = "default"
}) {
  return ( 
    <div className="container">
      <div className="row">
        
        <div className="col-6">
          <img src={imageURL} alt={productName} />
        </div>

        <div className="col-6 p-5 mt-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>

          {/* 🔹 LINKS SECTION */}
          {linkType === "default" && (
            <div>
              <a href={tryDemo} className="text-decoration-none">
                Try Demo <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </a>

              <a
                href={learnMore}
                className="text-decoration-none ms-5"
              >
                Learn More <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          )}

          {linkType === "coin" && (
            <div>
              <a href={learnMore} className="text-decoration-none">
                Coin  <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          )}

          
          <div className="mt-3">
            <a href={googlePlay}>
              <img src="images/googlePlayBadge.svg" alt="Google Play" />
            </a>

            <a href={appStore} className="ms-5">
              <img src="images/appstoreBadge.svg" alt="App Store" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LeftSection;
