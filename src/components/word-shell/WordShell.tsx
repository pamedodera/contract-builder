import { DocumentViewer } from '@/components/document/DocumentViewer'

// Figma asset URLs (valid for 7 days from design export)
const imgBottomBar = 'https://www.figma.com/api/mcp/asset/ddfd518c-2dbb-42bb-b866-92f61e06236e'
const imgWindowActions = 'https://www.figma.com/api/mcp/asset/9b73146d-0728-4bc4-99e0-80b340543c4d'
const imgToggle = 'https://www.figma.com/api/mcp/asset/6809b97e-49a7-45c8-9c66-5656a543f416'
const imgHome = 'https://www.figma.com/api/mcp/asset/d84bd2aa-8a8f-41ff-b25d-f608f5d4882c'
const imgVector27 = 'https://www.figma.com/api/mcp/asset/21f04fa0-5880-4c5d-9c5c-dea925556154'
const imgDropdown = 'https://www.figma.com/api/mcp/asset/84a6156c-7253-41b5-86d1-7e5debc1299d'
const imgEllipse11 = 'https://www.figma.com/api/mcp/asset/03ebe65b-ecf7-4e9d-bd5a-6c4259205593'
const imgVector35 = 'https://www.figma.com/api/mcp/asset/882e581a-cfa5-43f5-9292-39687cb4f700'
const imgSaveEdit = 'https://www.figma.com/api/mcp/asset/fb13c858-2c52-47bc-8f44-a3e1aab4949f'
const imgSearch = 'https://www.figma.com/api/mcp/asset/c168aade-c81e-40d9-b7ba-29774a018c56'
const imgVector = 'https://www.figma.com/api/mcp/asset/20eac633-1001-42cf-ab7f-d23b10904fdf'
const imgPencil = 'https://www.figma.com/api/mcp/asset/5e657710-cf18-47e2-9c38-6bed6b0290a4'
const imgVector1 = 'https://www.figma.com/api/mcp/asset/e296fdb0-8dc9-44a3-a379-013084992232'
const imgShare = 'https://www.figma.com/api/mcp/asset/282f76c9-7482-4ca4-95e3-932662064879'
const imgLine27 = 'https://www.figma.com/api/mcp/asset/11f1f4b8-665d-469a-b7c0-bc1a3f8acbce'
const imgClipboardDropdown = 'https://www.figma.com/api/mcp/asset/f913f44d-1485-4336-a5fe-e62b73dfa855'
const imgScisors = 'https://www.figma.com/api/mcp/asset/f639389b-4afe-480f-bb88-bf06fba473f3'
const imgCopy = 'https://www.figma.com/api/mcp/asset/ee0c9528-436d-4fa1-8cd8-106133044a10'
const imgPaintbrush = 'https://www.figma.com/api/mcp/asset/42fd74ea-42a7-407e-9f4c-0889cafb5ade'
const imgLine = 'https://www.figma.com/api/mcp/asset/5d6d85e9-a6cd-4bf0-9249-e7068d75fa70'
const imgVector20Stroke = 'https://www.figma.com/api/mcp/asset/532bc91f-3774-4972-a994-df084ae48b70'
const imgBigA = 'https://www.figma.com/api/mcp/asset/339c55f7-a95c-4f49-8589-616e06fdb0a9'
const imgLittleA = 'https://www.figma.com/api/mcp/asset/39ce9ecb-bb97-4b62-ba10-0651c69b5323'
const imgLine1 = 'https://www.figma.com/api/mcp/asset/877c2718-d2b0-451f-8487-f1368a02a581'
const imgFrame1 = 'https://www.figma.com/api/mcp/asset/2fbca237-cef9-48fd-a733-838c4c7a5f9d'
const imgEraseA = 'https://www.figma.com/api/mcp/asset/5248755b-4e83-4322-964e-1af7dced3644'
const imgTextChanges = 'https://www.figma.com/api/mcp/asset/6c93efc4-0255-4c43-b0a6-4f9d6c042eae'
const imgUnderline = 'https://www.figma.com/api/mcp/asset/39be7989-f24f-4d32-abe4-39e4a015ec40'
const imgVector2 = 'https://www.figma.com/api/mcp/asset/a155887d-5889-43ae-a5f6-30b43a7bc252'
const imgXLayout = 'https://www.figma.com/api/mcp/asset/778c2ab9-59d3-423e-b0e6-2a607a8fcb05'
const imgXLayout1 = 'https://www.figma.com/api/mcp/asset/4c2e18ad-772f-4c9f-9ae7-676c62942eb7'
const imgHighlightA = 'https://www.figma.com/api/mcp/asset/9409653d-1bb3-4d0d-9dc5-b10fe4b6f64a'
const imgHighlightYellow = 'https://www.figma.com/api/mcp/asset/9efebdf4-946a-4a58-b094-52bf940f1864'
const imgFontColro = 'https://www.figma.com/api/mcp/asset/817c2aec-f82e-4577-943a-49365950c06d'
const imgRow1 = 'https://www.figma.com/api/mcp/asset/78a6fa15-516a-4056-9137-be82aed30b0f'
const imgLeftAlign = 'https://www.figma.com/api/mcp/asset/7e2b1de0-f4d1-494d-b442-38f90b920b05'
const imgCenterAlign = 'https://www.figma.com/api/mcp/asset/afda192c-2d9b-4e38-8a2c-e538144db181'
const imgRightAlign = 'https://www.figma.com/api/mcp/asset/790a768d-281f-4e01-bcd8-2e17dd4851b2'
const imgRightAlign1 = 'https://www.figma.com/api/mcp/asset/dbe387fa-e440-4317-9973-025c8ef59ad3'
const imgFrame2 = 'https://www.figma.com/api/mcp/asset/6afce0cc-e302-49c8-95ae-77ffd676e506'
const imgFrame3 = 'https://www.figma.com/api/mcp/asset/84fbcfec-d52c-48d0-9e57-5a7b54a6b8f1'
const imgFrame4 = 'https://www.figma.com/api/mcp/asset/a1be2f1e-d3ce-4126-9a2a-05524b2122ca'
const imgFrame5 = 'https://www.figma.com/api/mcp/asset/ee03d3fa-5985-45fe-9740-65736bbd5d2c'
const imgMicrophone = 'https://www.figma.com/api/mcp/asset/15f74b4f-80a1-4190-9f8d-b3365e186e43'
const imgTextWrap = 'https://www.figma.com/api/mcp/asset/125ff57a-9ec6-4088-80b8-93e245fb1155'
const imgEditorIcon = 'https://www.figma.com/api/mcp/asset/d59eb252-a93f-4f47-ad37-6d6ee1947e73'
const imgZoom = 'https://www.figma.com/api/mcp/asset/90f9d171-a591-451d-b893-efe00cc3c520'
const imgDefinelyLogo = 'https://www.figma.com/api/mcp/asset/5a11308d-0758-43a4-bcad-258d0d3b0056'

// Vertical divider used in ribbon
function RibbonDivider() {
  return (
    <div className="flex flex-row items-center self-stretch pointer-events-none select-none">
      <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ containerType: 'size' }}>
        <div className="flex-none rotate-90 w-[100cqh]">
          <div className="h-0 relative w-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface WordShellProps {
  sidebar: React.ReactNode
  onAskContext?: (text: string) => void
  onEditContext?: (text: string) => void
  onSelectionChange?: (text: string) => void
}

export function WordShell({ sidebar, onAskContext, onEditContext, onSelectionChange }: WordShellProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

      {/* ── Top bar ── */}
      <div className="bg-[#e8e8e8] flex gap-6 items-center px-3 py-1.5 shrink-0 w-full pointer-events-none select-none">
        {/* macOS window controls */}
        <div className="h-3 relative shrink-0 w-[54px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgWindowActions} />
        </div>
        {/* Top left actions */}
        <div className="flex gap-3 items-center relative shrink-0">
          {/* AutoSave */}
          <div className="flex gap-2 items-center relative shrink-0">
            <span className="text-[#7f7f7d] text-[12px] font-medium whitespace-nowrap">AutoSave</span>
            <div className="h-[14px] relative shrink-0 w-[28px]">
              <img alt="" className="block max-w-none size-full" src={imgToggle} />
            </div>
          </div>
          <div className="h-[15px] relative shrink-0 w-[13.5px]">
            <img alt="" className="block max-w-none size-full" src={imgHome} />
          </div>
          <div className="h-[15.6px] relative shrink-0 w-[11.8px]">
            <img alt="" className="block max-w-none size-full" src={imgVector27} />
          </div>
          <div className="h-[4.5px] relative shrink-0 w-[6.5px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDropdown} />
          </div>
          <div className="relative shrink-0 size-[14px]">
            <img alt="" className="block max-w-none size-full" src={imgEllipse11} />
          </div>
          <div className="h-[13px] relative shrink-0 w-[15px]">
            <img alt="" className="block max-w-none size-full" src={imgVector35} />
          </div>
          <div className="h-[15px] relative shrink-0 w-[16px]">
            <img alt="" className="block max-w-none size-full" src={imgSaveEdit} />
          </div>
        </div>
        {/* Filename centered */}
        <div className="flex-1 min-w-0 text-[#444] text-[12px] font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis">
          Professional Service Agreement.docx
        </div>
        {/* Search bar */}
        <div className="border-[#d0d0d0] border-[0.5px] border-solid flex gap-2 h-6 items-center px-2 py-1.5 relative rounded-[6px] shrink-0 w-[286px] bg-white/50">
          <div className="relative shrink-0 size-3">
            <img alt="" className="block max-w-none size-full" src={imgSearch} />
          </div>
          <span className="text-[#d0d0d0] text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            Search (Cmd + Ctrl + U)
          </span>
        </div>
      </div>

      {/* ── Header (nav + ribbon) ── */}
      <div className="bg-[#e8e8e8] flex flex-col gap-2.5 items-start p-3 shrink-0 w-full pointer-events-none select-none">

        {/* Navigation row */}
        <div className="flex items-center justify-between relative shrink-0 w-full">
          {/* Menu tabs */}
          <div className="flex gap-6 items-center text-[#444] text-[13px] whitespace-nowrap">
            <span className="font-bold">Home</span>
            <span className="font-medium">Insert</span>
            <span className="font-medium">Draw</span>
            <span className="font-medium">Layout</span>
            <span className="font-medium">References</span>
            <span className="font-medium">Mailings</span>
            <span className="font-medium">Review</span>
            <span className="font-medium">View</span>
          </div>
          {/* Right action buttons */}
          <div className="flex gap-2 items-center">
            <div className="bg-white border-[#d0d0d0] border-[0.5px] border-solid flex h-6 items-center px-2 py-1.5 relative rounded-[6px] shrink-0">
              <div className="flex gap-1.5 items-center">
                <div className="relative shrink-0 size-[14px]">
                  <img alt="" className="block max-w-none size-full" src={imgVector} />
                </div>
                <span className="text-[13px] text-black font-medium whitespace-nowrap">Comments</span>
              </div>
            </div>
            <div className="bg-white border-[#d0d0d0] border-[0.5px] border-solid flex h-6 items-center px-2 py-1.5 relative rounded-[6px] shrink-0">
              <div className="flex gap-1.5 items-center">
                <div className="relative shrink-0 size-[15px]">
                  <img alt="" className="block max-w-none size-full" src={imgPencil} />
                </div>
                <span className="text-[13px] text-black font-medium whitespace-nowrap">Editing</span>
                <div className="h-1 relative shrink-0 w-[7px]">
                  <img alt="" className="block max-w-none size-full" src={imgVector1} />
                </div>
              </div>
            </div>
            <div className="bg-white border-[#d0d0d0] border-[0.5px] border-solid flex h-6 items-center px-2 py-1.5 relative rounded-[6px] shrink-0">
              <div className="flex gap-1.5 items-center">
                <div className="h-[13px] relative shrink-0 w-[14px]">
                  <img alt="" className="block max-w-none size-full" src={imgShare} />
                </div>
                <span className="text-[13px] text-black font-medium whitespace-nowrap">Share</span>
                <div className="h-1 relative shrink-0 w-[7px]">
                  <img alt="" className="block max-w-none size-full" src={imgVector1} />
                </div>
              </div>
            </div>
          </div>
          {/* Home tab underline */}
          <div className="absolute h-0 left-px top-[23px] w-[36px]">
            <div className="absolute inset-[-1px_-2.78%]">
              <img alt="" className="block max-w-none size-full" src={imgLine27} />
            </div>
          </div>
        </div>

        {/* Ribbon toolbar */}
        <div className="bg-[#e8e8e8] flex gap-3 items-center px-2 relative shrink-0 w-full">

          {/* Clipboard group */}
          <div className="flex gap-3 items-center relative shrink-0">
            <div className="flex flex-col gap-1 items-center justify-center relative shrink-0">
              <div className="h-8 relative shrink-0 w-[38.5px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgClipboardDropdown} />
              </div>
              <span className="text-[#7f7f7d] text-[11px] font-medium tracking-[0.055px] w-[34px]">Paste</span>
            </div>
            <div className="flex flex-col gap-1 items-start justify-center relative shrink-0">
              <div className="flex items-start justify-center relative shrink-0 w-4">
                <div className="h-[17px] relative shrink-0 w-[11.5px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgScisors} />
                </div>
              </div>
              <div className="h-[17px] relative shrink-0 w-[28.5px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCopy} />
              </div>
              <div className="h-[14.5px] relative shrink-0 w-4">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPaintbrush} />
              </div>
            </div>
          </div>

          <RibbonDivider />

          {/* Font options */}
          <div className="flex flex-col gap-2.5 h-12 items-start justify-center relative shrink-0">
            {/* Row 1: font selector, size, A sizes, formatting toggle, erase */}
            <div className="flex gap-2.5 h-[18px] items-center relative shrink-0">
              <div className="flex gap-1 items-center relative shrink-0">
                <div className="bg-white border-[#d0d0d0] border-[0.5px] border-solid flex gap-2 h-6 items-center px-2 py-1.5 relative rounded-[4px] shrink-0 w-[109px]">
                  <span className="flex-1 text-[13px] text-black font-medium overflow-hidden text-ellipsis whitespace-nowrap">Aptos (body)</span>
                  <div className="h-[4.5px] relative shrink-0 w-[6.5px]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector20Stroke} />
                  </div>
                </div>
                <div className="bg-white border-[#d0d0d0] border-[0.5px] border-solid flex gap-2 h-6 items-center px-2 py-1.5 relative rounded-[4px] shrink-0 w-[53px]">
                  <span className="flex-1 text-[13px] text-black font-medium overflow-hidden text-ellipsis whitespace-nowrap">12</span>
                  <div className="h-[4.5px] relative shrink-0 w-[6.5px]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector20Stroke} />
                  </div>
                </div>
              </div>
              <div className="h-[13px] relative shrink-0 w-[16px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBigA} />
              </div>
              <div className="h-[13px] relative shrink-0 w-[14px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLittleA} />
              </div>
              <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ containerType: 'size' }}>
                <div className="flex-none rotate-90 w-[100cqh]">
                  <div className="h-0 relative w-full">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[10px] relative shrink-0 w-[30.5px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
              </div>
              <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ containerType: 'size' }}>
                <div className="flex-none rotate-90 w-[100cqh]">
                  <div className="h-0 relative w-full">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[14.8px] relative shrink-0 w-[15px]">
                <img alt="" className="block max-w-none size-full" src={imgEraseA} />
              </div>
            </div>
            {/* Row 2: bold/italic/underline, superscript, highlight, font color */}
            <div className="flex gap-3.5 h-[18px] items-center relative shrink-0">
              <div className="flex gap-4 items-center relative shrink-0">
                <div className="h-[10px] relative shrink-0 w-[31px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTextChanges} />
                </div>
                <div className="h-[11px] relative shrink-0 w-[24.5px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUnderline} />
                </div>
              </div>
              <div className="h-[10px] relative shrink-0 w-[16.6px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector2} />
              </div>
              <div className="h-4 relative shrink-0 w-[11.5px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXLayout} />
              </div>
              <div className="h-4 relative shrink-0 w-[11.5px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXLayout1} />
              </div>
              <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ containerType: 'size' }}>
                <div className="flex-none rotate-90 w-[100cqh]">
                  <div className="h-0 relative w-full">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-3 relative shrink-0 w-[26.5px]">
                <img alt="" className="block max-w-none size-full" src={imgHighlightA} />
              </div>
              <div className="h-4 relative shrink-0 w-[31px]">
                <img alt="" className="block max-w-none size-full" src={imgHighlightYellow} />
              </div>
              <div className="h-4 relative shrink-0 w-[31px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFontColro} />
              </div>
            </div>
          </div>

          <RibbonDivider />

          {/* Paragraph options */}
          <div className="flex flex-col h-12 items-start justify-between relative shrink-0">
            <div className="h-[18px] relative shrink-0 w-[248.6px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgRow1} />
            </div>
            <div className="flex gap-2.5 h-[18px] items-center relative shrink-0">
              <div className="flex gap-3 items-center relative shrink-0">
                <div className="h-3 relative shrink-0 w-[14px]">
                  <img alt="" className="block max-w-none size-full" src={imgLeftAlign} />
                </div>
                <div className="h-3 relative shrink-0 w-[14px]">
                  <img alt="" className="block max-w-none size-full" src={imgCenterAlign} />
                </div>
                <div className="h-3 relative shrink-0 w-[14px]">
                  <img alt="" className="block max-w-none size-full" src={imgRightAlign} />
                </div>
                <div className="h-3 relative shrink-0 w-[14px]">
                  <img alt="" className="block max-w-none size-full" src={imgRightAlign1} />
                </div>
              </div>
              <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ containerType: 'size' }}>
                <div className="flex-none rotate-90 w-[100cqh]">
                  <div className="h-0 relative w-full">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-3 relative shrink-0 w-[30.5px]">
                <img alt="" className="block max-w-none size-full" src={imgFrame2} />
              </div>
              <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ containerType: 'size' }}>
                <div className="flex-none rotate-90 w-[100cqh]">
                  <div className="h-0 relative w-full">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-4 relative shrink-0 w-[31px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
              <div className="h-[15px] relative shrink-0 w-[29.5px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
              </div>
            </div>
          </div>

          <RibbonDivider />

          {/* Styles panel */}
          <div className="border border-[#d0d0d0] border-solid flex flex-1 items-center min-w-0 overflow-clip relative rounded-[4px]">
            <div className="bg-white flex flex-1 h-[58px] items-center min-w-0 overflow-clip relative rounded-[3px]">
              <div className="flex flex-1 gap-2 h-full items-center min-w-0 pl-5 pr-2 py-1.5 relative">
                {/* Selected style (Normal) */}
                <div className="bg-white border border-[#5999cc] border-solid flex flex-col h-full items-center relative rounded-[2px] shrink-0">
                  <div className="bg-gradient-to-b border-[#d0d0d0] border-[0.25px] border-solid flex flex-1 flex-col from-white items-start min-h-px overflow-clip relative rounded-[2px] to-[#f9f9f9]">
                    <div className="bg-white flex flex-1 items-center min-h-px px-0.5 py-0.5 relative w-[70px]">
                      <div className="flex flex-1 items-center min-w-px overflow-clip py-1 relative">
                        <span className="text-[#444] text-[11px] whitespace-nowrap">AaBbCcDdEeFfGgHh</span>
                      </div>
                    </div>
                    <div className="bg-[#fafafa] border-[#ededed] border-solid border-t-[0.25px] flex flex-col h-[14px] items-center justify-center relative shrink-0 w-[70px]">
                      <span className="text-[#7f7f7d] text-[8.5px] text-center">Normal</span>
                    </div>
                  </div>
                </div>
                {/* No Spacing */}
                <div className="bg-gradient-to-b border-[#d0d0d0] border-[0.25px] border-solid flex flex-col from-white h-full items-start overflow-clip relative rounded-[2px] shrink-0 to-[#f9f9f9]">
                  <div className="bg-white flex flex-1 items-center min-h-px px-0.5 py-0.5 relative w-[70px]">
                    <div className="flex flex-1 items-center min-w-px overflow-clip py-1 relative">
                      <span className="text-[#444] text-[11px] tracking-[-0.22px] whitespace-nowrap">AaBbCcDdEeFfGgHh</span>
                    </div>
                  </div>
                  <div className="bg-[#fafafa] border-[#ededed] border-solid border-t-[0.25px] flex flex-col h-[14px] items-center justify-center relative shrink-0 w-[70px]">
                    <span className="text-[#7f7f7d] text-[8.5px] text-center">No Spacing</span>
                  </div>
                </div>
                {/* Title */}
                <div className="bg-gradient-to-b border-[#d0d0d0] border-[0.25px] border-solid flex flex-col from-white h-full items-start overflow-clip relative rounded-[2px] shrink-0 to-[#f9f9f9]">
                  <div className="bg-white flex flex-1 items-center min-h-px px-0.5 py-0.5 relative w-[70px]">
                    <div className="flex flex-1 items-center min-w-px overflow-clip py-1 relative">
                      <span className="text-[#444] text-[14px] font-medium whitespace-nowrap">AaBbCcDdEeFfGgHh</span>
                    </div>
                  </div>
                  <div className="bg-[#fafafa] border-[#ededed] border-solid border-t-[0.25px] flex flex-col h-[14px] items-center justify-center relative shrink-0 w-[70px]">
                    <span className="text-[#7f7f7d] text-[8.5px] text-center">Title</span>
                  </div>
                </div>
                {/* Heading 1 */}
                <div className="bg-gradient-to-b border-[#d0d0d0] border-[0.25px] border-solid flex flex-col from-white h-full items-start overflow-clip relative rounded-[2px] shrink-0 to-[#f9f9f9]">
                  <div className="bg-white flex flex-1 items-center min-h-px px-0.5 py-0.5 relative w-[70px]">
                    <div className="flex flex-1 items-center min-w-px overflow-clip py-1 relative">
                      <span className="text-[#5f9dce] text-[14px] font-medium whitespace-nowrap">AaBbCcDdEeFfGgHh</span>
                    </div>
                  </div>
                  <div className="bg-[#fafafa] border-[#ededed] border-solid border-t-[0.25px] flex flex-col h-[14px] items-center justify-center relative shrink-0 w-[70px]">
                    <span className="text-[#7f7f7d] text-[8.5px] text-center">Heading 1</span>
                  </div>
                </div>
                {/* Heading 2 */}
                <div className="bg-gradient-to-b border-[#d0d0d0] border-[0.25px] border-solid flex flex-col from-white h-full items-start overflow-clip relative rounded-[2px] shrink-0 to-[#f9f9f9]">
                  <div className="bg-white flex flex-1 items-center min-h-px px-0.5 py-0.5 relative w-[70px]">
                    <div className="flex flex-1 items-center min-w-px overflow-clip py-1 relative">
                      <span className="text-[#7f7f7d] text-[14px] font-light whitespace-nowrap">AaBbCcDdEeFfGgHh</span>
                    </div>
                  </div>
                  <div className="bg-[#fafafa] border-[#ededed] border-solid border-t-[0.25px] flex flex-col h-[14px] items-center justify-center relative shrink-0 w-[70px]">
                    <span className="text-[#7f7f7d] text-[8.5px] text-center">Heading 2</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Scroll arrows */}
            <div className="absolute h-[58px] right-[-1px] top-[-1px] w-[14px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame5} />
            </div>
          </div>

          <RibbonDivider />

          {/* Dictate */}
          <div className="flex flex-col gap-1.5 h-full items-center justify-center relative shrink-0 w-[42px]">
            <div className="h-[30px] relative shrink-0 w-[18px]">
              <img alt="" className="block max-w-none size-full" src={imgMicrophone} />
            </div>
            <span className="text-[#7f7f7d] text-[11px] font-medium text-center tracking-[0.055px]">Dictate</span>
          </div>

          <RibbonDivider />

          {/* Add-ins */}
          <div className="flex flex-col gap-1.5 h-full items-center justify-center relative shrink-0 w-[42px]">
            <div className="relative shrink-0 size-[29px]">
              <img alt="" className="block max-w-none size-full" src={imgTextWrap} />
            </div>
            <span className="text-[#7f7f7d] text-[11px] font-medium text-center tracking-[0.055px]">Add-ins</span>
          </div>

          <RibbonDivider />

          {/* Editor */}
          <div className="flex flex-col gap-1.5 h-full items-center justify-center relative shrink-0 w-[42px]">
            <div className="h-[30.5px] relative shrink-0 w-[30px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEditorIcon} />
            </div>
            <span className="text-[#7f7f7d] text-[11px] font-medium text-center tracking-[0.055px]">Editor</span>
          </div>

          <RibbonDivider />

          {/* Definely */}
          <div className="flex flex-col gap-1.5 h-full items-center justify-center relative shrink-0 w-[42px]">
            <div className="h-[29px] relative shrink-0 w-[30px]">
              <img alt="" className="block max-w-none size-full" src={imgDefinelyLogo} />
            </div>
            <span className="text-[#7f7f7d] text-[11px] font-medium text-center tracking-[0.055px]">Definely</span>
          </div>

        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-1 overflow-hidden border-t border-[#d0d0d0]">
        {/* Document area — takes remaining space after sidebar claims w-1/3 */}
        <div className="bg-[#f0f0f0] flex flex-1 overflow-hidden pt-5 px-5">
          <div className="flex flex-col flex-1 overflow-hidden bg-white border-[#d0d0d0] border-l border-r border-solid border-t rounded-bl-sm rounded-br-sm shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]">
            <DocumentViewer
              onTermClick={() => {}}
              onAskContext={onAskContext}
              onEditContext={onEditContext}
              onSelectionChange={onSelectionChange}
            />
          </div>
        </div>
        {/* Definely sidebar — rendered directly so its own w-1/3 applies to the full flex row */}
        {sidebar}
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-[#d0d0d0] border-solid border-t flex h-6 items-center justify-between px-6 relative shrink-0 w-full pointer-events-none select-none overflow-hidden">
        <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgBottomBar} />
        <div className="flex flex-1 gap-4 items-center text-[#444] text-[12px] whitespace-nowrap relative z-10">
          <span>Page 1 of 1</span>
          <span>0 words</span>
          <span>English (United States)</span>
          <span>Accessibility: Good to go</span>
        </div>
        <div className="flex gap-4 items-center relative z-10">
          <div className="h-4 relative shrink-0 w-[127px]">
            <img alt="" className="block max-w-none size-full" src={imgZoom} />
          </div>
          <span className="text-[#444] text-[13px] text-center tracking-[0.065px] whitespace-nowrap">300%</span>
        </div>
      </div>

    </div>
  )
}
