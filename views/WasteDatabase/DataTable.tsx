import React from 'react';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { WasteType } from '../../types';
import { EnhancedWasteProperty } from './FilterPanel';

interface DataTableProps {
  data: EnhancedWasteProperty[];
  selectedItems: string[];
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onSort: (key: keyof EnhancedWasteProperty) => void;
  onViewDetail: (item: EnhancedWasteProperty) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  sortConfig: { key: keyof EnhancedWasteProperty | null; direction: 'ascending' | 'descending' };
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  selectedItems,
  onSelectAll,
  onSelectItem,
  onSort,
  onViewDetail,
  currentPage,
  onPageChange,
  itemsPerPage,
  sortConfig
}) => {
  // 计算总页数
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // 计算当前页数据
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">固废数据列表</h3>
      </div>
      
      <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px] md:min-w-[1200px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-12">
                <input 
                  type="checkbox" 
                  className="rounded text-emerald-600 focus:ring-emerald-500" 
                  checked={paginatedData.length > 0 && selectedItems.length === paginatedData.length}
                  onChange={onSelectAll}
                />
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>固废名称</span>
                </div>
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>基本类型</span>
                </div>
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onSort('ph')}
              >
                <div className="flex items-center space-x-1">
                  <span>pH值</span>
                </div>
              </th>
              <th 
                className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => onSort('organicMatter')}
              >
                <div className="flex items-center space-x-1">
                  <span>有机质 (%)</span>
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">主要重金属</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">毒性等级</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">数据来源</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded text-emerald-600 focus:ring-emerald-500" 
                    checked={selectedItems.includes(item.id)}
                    onChange={() => onSelectItem(item.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => onViewDetail(item)}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {item.id.padStart(6, '0')}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === WasteType.Tailings ? 'bg-stone-100 text-stone-700' : item.type === WasteType.Sludge ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-700">{item.ph}</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-700">{item.organicMatter}%</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs space-y-0.5">
                    <span className="text-slate-600">Cd: {item.heavyMetals.cd} mg/kg</span>
                    <span className="text-slate-600">Pb: {item.heavyMetals.pb} mg/kg</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.toxicityLevel === '低' ? 'bg-green-50 text-green-700' : item.toxicityLevel === '中' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                    {item.toxicityLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.dataSource}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" onClick={() => onViewDetail(item)}>
                      <ExternalLink size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            显示第 {((currentPage - 1) * itemsPerPage) + 1} 到 {Math.min(currentPage * itemsPerPage, data.length)} 条，共 {data.length} 条记录
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="px-3 py-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              上一页
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`px-3 py-1 text-sm rounded-lg shadow-sm transition-all ${currentPage === page ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              className="px-3 py-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
