import React from 'react';

function Universe() {
    return ( 
        <div className="container mt-5"> <div className="row text-center"> 
        <h1 className='fs-3 mt-2 mb-4'>The Zerodha Universe</h1>
        <p>Extend your trading and investment experience even further with our partner platforms</p>
         <div className="col-4 p-3  mt-5">
             <img src="images/smallcaseLogo.png" className="universe-logo"/>
             <p className='text-small text-muted'>Thematic investing platform</p>
          </div>
          <div className="col-4 p-3  mt-5">
             <img src="images/streakLogo.png" className="universe-logo"/>
             <p className='text-small text-muted'>Algo & strategy platform</p>
          </div>
          <div className="col-4 p-3  mt-5">
             <img src="images/sensibullLogo.svg" className="universe-logo"/>
             <p className='text-small text-muted'>Optioons trading platform</p>
          </div>
          <div className="col-4 p-3  mt-5">
             <img src="images/zerodhaFundhouse.png" className="universe-logo"/>
             <p className='text-small text-muted'>Asset management</p>
          </div>
          <div className="col-4 p-3  mt-5">
             <img src="images/goldenpiLogo.png" className="universe-logo"/>
             <p className='text-small text-muted'>Bonnds trading platorm</p>
          </div>
          <div className="col-4 p-3  mt-5">
             <img src="images/dittoLogo.png" className="universe-logo"/>
             <p className='text-small text-muted'>Insurance</p>
          </div>
          <button className='p-2 btn btn-primary fs-5 mb-5' style={{width:"20%", margin:"0 auto"}}>Signup Now</button>
           </div> 
           </div>
     );
}

export default Universe;