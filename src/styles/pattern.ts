/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-07-01 16:51:57
 * @LastEditors: didadida262
 * @LastEditTime: 2024-07-16 16:36:24
 */
const pattern = {
  contentContainer: 'w-full max-w-[981px] flex flex-col items-center',
  contentHeader:
    // 失效
    // 'markBorderG h-[108px] sticky top-0 z-10 bg-bgPrimaryContentColor flex justify-between items-center flex-col w-full',
    ' sticky top-0 z-10 flex justify-between items-center flex-col w-full',
  contentContainerList: '',
  pageTitle:
    'text-textPrimaryColor text-textFirstSize leading-[27px] font-bold',
  leading77:
    'leading-[46px] sm:leading-[77px] md:leading-[77px] lg:leading-[77px] xl:leading-[77px] 2xl:leading-[77px]',
  leading72:
    'xs:leading-[27px] sm:leading-[72px] md:leading-[72px] lg:leading-[72px] xl:leading-[72px] 2xl:leading-[72px]',
  leading36:
    'leading-[24px] sm:leading-[36px] md:leading-[36px] lg:leading-[36px] xl:leading-[36px] 2xl:leading-[36px]',
  leading27:
    'xs:[21px] sm:leading-[27px] md:leading-[27px] lg:leading-[27px] xl:leading-[27px] 2xl:leading-[27px]',
  leading24:
    'xs:[24px] sm:leading-[24px] md:leading-[24px] lg:leading-[24px] xl:leading-[24px] 2xl:leading-[24px]',
  square:
    'lg:w-[48px] xl:w-[53px] 2xl:w-[57px] lg:h-[48px] xl:h-[53px] 2xl:h-[57px] h-[44px] w-[44px] bg-[#A364FF] inline-block',

  /* Layout */
  innerWidth: 'max-w-[1280px] w-full',
  interWidth: 'lg:w-4/5 w-full',

  paddings: 'px-6 pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:py-[120px] 2xl:py-36',
  yPaddings: 'py-12 sm:py-16 xl:py-24 2xl:py-32',
  xPaddings: 'px-10 sm:px-16',
  topPaddings: 'pt-12 sm:pt-16',
  sectionPadding: 'px-6 pt-[30px]',
  footerPaddings: 'px-6 sm:px-8 pb-6 sm:pb-8 pt-3 sm:pt-4',

  flexCenter: 'flex justify-center items-center',
  flexCenterCol: 'flex justify-center items-center flex-col',
  flexbetCol: 'flex justify-between items-center flex-col',
  flexbet: 'flex justify-between items-center',
  flexaround: 'flex justify-around items-center',
  flexStartResponsive:
    'flex sm:justify-start md:justify-start lg:justify-start xl:justify-start 2xl:justify-start',
  flexStart: 'flex justify-start items-center',
  flexEnd: 'flex justify-end',
  flexMobileResponsiveCol:
    'xs:flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row',
  dappsContainer: 'relative pt-[50px] px-6 pb-[20px]',

  /* Font */
  fontOswald16:
    'font-Oswald sm:text-textThirdSize md:text-textThirdSize lg:text-textThirdSize xl:text-textThirdSize 2xl:text-textThirdSize',
  fontOswald18:
    'font-Oswald sm:text-textSecondSize md:text-textSecondSize lg:text-textSecondSize xl:text-textSecondSize 2xl:text-textSecondSize',
  fontOswald24:
    'font-Oswald xs:text-textFirstSize sm:text-[24px] md:text-[24px] lg:text-[24px] xl:text-[24px] 2xl:text-[24px]',
  fontOswald32:
    'font-Oswald sm:text-[32px] md:text-[32px] lg:text-[32px] xl:text-[32px] 2xl:text-[32px]',
  fontOswald36:
    'font-Oswald sm:text-[36px] md:text-[36px] lg:text-[36px] xl:text-[36px] 2xl:text-[36px]',
  fontOswald46:
    'font-Oswald sm:text-[46px] md:text-[46px] lg:text-[46px] xl:text-[46px] 2xl:text-[46px]',
  fontOswald48:
    'font-Oswald xs:text-textSecondSize sm:text-[48px] md:text-[48px] lg:text-[48px] xl:text-[48px] 2xl:text-[48px]',
  fontOswald52:
    'font-Oswald sm:text-[52px] md:text-[52px] lg:text-[52px] xl:text-[52px] 2xl:text-[52px]',
  fontPop14:
    'font-Poppins sm:text-textFourthSize md:text-textFourthSize lg:text-textFourthSize xl:text-textFourthSize 2xl:text-textFourthSize',
  fontPop16:
    'font-Poppins xs:text-textThirdSize sm:text-textThirdSize md:text-textThirdSize lg:text-textThirdSize xl:text-textThirdSize 2xl:text-textThirdSize',
  fontPop18:
    'font-Poppins xs:text-textFourthSize sm:text-textSecondSize md:text-textSecondSize lg:text-textSecondSize xl:text-textSecondSize 2xl:text-textSecondSize',
  fontPop20:
    'font-Poppins sm:text-textFirstSize md:text-textFirstSize lg:text-textFirstSize xl:text-textFirstSize 2xl:text-textFirstSize',
  fontPop24:
    'font-Poppins xs:text-textThirdSize sm:text-[24px] md:text-[24px] lg:text-[24px] xl:text-[24px] 2xl:text-[24px]',
  fontPop36:
    'font-Poppins xs:text-textSecondSize sm:text-[36px] md:text-[36px] lg:text-[36px] xl:text-[36px] 2xl:text-[36px]',
  fontInter16:
    'font-Inter sm:text-textThirdSize md:text-textThirdSize lg:text-textThirdSize xl:text-textThirdSize 2xl:text-textThirdSize'
};
export default pattern;
