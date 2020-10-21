const alVRTestHelper = require('../index.cjs');
const init = async () => {
    try{
        if (process.env.SUITE === 'visualRegression') {
            await alVRTestHelper.generateVRHTMLReport();
        }else{
            alVRTestHelper.generateScreenshotReportHTML();
        }
    }catch(error){
        console.log(error);
    }
    alVRTestHelper.generateConsoleHTMLReportPuppeteer();
};
init();
