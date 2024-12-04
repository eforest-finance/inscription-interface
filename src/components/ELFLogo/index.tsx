import ELF, { ReactComponent as ElfComp } from 'assets/images/elf-icon-blue.svg';
import TEST_ELF, { ReactComponent as ElfTestComp } from 'assets/images/elf-icon.svg';

const { NEXT_PUBLIC_APP_ENV } = process.env;

const ELF_LOGO = TEST_ELF;
const ReactComponent = NEXT_PUBLIC_APP_ENV === 'production' ? ElfComp : ElfTestComp;

export default ELF_LOGO;

export { ReactComponent };
