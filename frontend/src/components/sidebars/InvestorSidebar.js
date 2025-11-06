'use client'
import ThumbnailList from '@/components/dashboard/investor/ThumbnailList'
import { useInvestorStore } from '@/store/investor.store'

export function InvestorSidebar() {
  const totalEarnings = useInvestorStore((s) => s.totalEarnings)
  const earningsChangePercent = useInvestorStore((s) => s.earningsChangePercent)
  const completedDeals = useInvestorStore((s) => s.completedDeals)

  return (
    <div className="flex flex-col items-start p-0 w-full max-w-[269px]" style={{ gap: '24px' }}>
      {/* Project Title */}
      <div>
        <h1 className="text-sm font-semibold text-neutral-900">Project Lacasa Virtual Tour</h1>
      </div>

      {/* Thumbnails */}
      <div className="w-full">
        <ThumbnailList />
      </div>

      {/* Total Earnings and Total increase - side by side */}
      <div className="w-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] text-neutral-400 mb-0.5 font-normal">Total Earnings</div>
            <div className="text-lg font-bold text-neutral-900 tabular-nums">${totalEarnings.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-neutral-400 mb-0.5 font-normal">Total increase</div>
            <div className="text-lg font-bold text-neutral-900 tabular-nums">{earningsChangePercent}%</div>
          </div>
        </div>
      </div>

      {/* Completed Deals - light emerald background */}
      <div className="w-full bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded bg-white flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="text-[10px] text-neutral-500 font-medium">Completed Deals</div>
        </div>
        <div className="flex items-end justify-between mb-1.5">
          <div className="text-base font-bold text-neutral-900 tabular-nums">{completedDeals.toLocaleString()}</div>
          <div className="text-xs font-medium text-neutral-500 tabular-nums">20%</div>
        </div>
        <div className="w-full bg-emerald-200 h-1 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-1 rounded-full transition-all" style={{width:'20%'}}/>
        </div>
      </div>

      {/* Total Revenue - light yellow background */}
      <div className="w-full bg-yellow-50 rounded-xl p-2.5 border border-yellow-100">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded bg-white flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="text-[10px] text-neutral-500 font-medium">Total Revenue</div>
        </div>
        <div className="flex items-end justify-between mb-1.5">
          <div className="text-base font-bold text-neutral-900 tabular-nums">{completedDeals.toLocaleString()}</div>
          <div className="text-xs font-medium text-neutral-500 tabular-nums">20%</div>
        </div>
        <div className="w-full bg-yellow-200 h-1 rounded-full overflow-hidden">
          <div className="bg-yellow-500 h-1 rounded-full transition-all" style={{width:'20%'}}/>
        </div>
      </div>
    </div>
  )
}
export default InvestorSidebar