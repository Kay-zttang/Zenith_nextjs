import { CpuChipIcon } from '@heroicons/react/24/outline';
/*import { lusitana } from '@/app/ui/fonts';*/
import { kumar_one } from '@/app/ui/fonts';

export default function ZenithLogo() {
  return (
    <div
      className={`${kumar_one.className} flex flex-row items-center leading-none text-white`}
    >
      <CpuChipIcon className="h-12 w-12 rotate-[15deg]" />
      <p className=" text-[44px] pt-3">Zenith</p>
    </div>
  );
}
