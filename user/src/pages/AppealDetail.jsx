import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertCircle, Clock, CheckCircle2, MapPin, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

const catAz = { 'Roads & Transport': 'Yollar və Nəqliyyat', 'Utilities': 'Kommunal Xidmətlər', 'Parks & Environment': 'Parklar və Ətraf Mühit', 'Public Safety': 'İctimai Təhlükəsizlik', 'Waste Management': 'Tullantıların İdarə Edilməsi', 'Building & Infrastructure': 'Bina və İnfrastruktur', 'Other': 'Digər' };
const priAz = { 'Low': 'Aşağı', 'Medium': 'Orta', 'High': 'Yüksək', 'Critical': 'Kritik' };

export default function AppealDetail() {
    const { id } = useParams();
    const [appeal, setAppeal] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppeal = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/appeals/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('asanToken')}` }
                });
                if (res.data.success) setAppeal(res.data.data.appeal);
            } catch {
                setError('Müraciət detalları yüklənmədi');
            }
        };
        fetchAppeal();
    }, [id]);

    const statusBadge = (status) => {
        switch (status) {
            case 'Resolved':
                return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> Həll olunub</span>;
            case 'Pending Review':
                return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold"><Clock className="w-3 h-3" /> Gözləmədə</span>;
            case 'Rejected':
                return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><AlertCircle className="w-3 h-3" /> Rədd edilib</span>;
            default:
                return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><AlertCircle className="w-3 h-3" /> {status === 'Mismatch - Return Back' ? 'Uyğunsuzluq - Geri Qaytarılıb' : status}</span>;
        }
    };

    if (error) return <div className="max-w-3xl mx-auto px-4 py-8"><div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div></div>;
    if (!appeal) return <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
            <Link to="/my-appeals" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-medium transition">
                <ArrowLeft className="w-5 h-5" /> Müraciətlərimə Qayıt
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Image */}
                {appeal.initialMediaId?.url && (
                    <img src={`${API_URL}${appeal.initialMediaId.url}`} alt="Müraciət" className="w-full max-h-80 object-cover" />
                )}

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{appeal.title || appeal.category || 'Müraciət'}</h1>
                        {statusBadge(appeal.status)}
                    </div>

                    {/* Description */}
                    {appeal.description && (
                        <div>
                            <label className="text-xs text-slate-500 font-semibold uppercase block mb-1">Təsvir</label>
                            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg text-sm leading-relaxed">{appeal.description}</p>
                        </div>
                    )}

                    {/* Info Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                            <label className="text-xs text-slate-500 font-semibold uppercase block mb-1">Kateqoriya</label>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-sm font-semibold">{catAz[appeal.category] || appeal.category || '—'}</span>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 font-semibold uppercase block mb-1">Prioritet</label>
                            <span className={`px-3 py-1 rounded text-sm font-semibold ${appeal.priority === 'Critical' ? 'bg-red-100 text-red-700' : appeal.priority === 'High' ? 'bg-orange-100 text-orange-700' : appeal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                {priAz[appeal.priority] || appeal.priority || '—'}
                            </span>
                        </div>
                        {appeal.location?.coordinates?.lat && (
                            <div>
                                <label className="text-xs text-slate-500 font-semibold uppercase block mb-1">Məkan</label>
                                <a href={`https://www.google.com/maps?q=${appeal.location.coordinates.lat},${appeal.location.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                    <MapPin className="w-4 h-4" />
                                    {appeal.location.coordinates.lat.toFixed(5)}, {appeal.location.coordinates.lng.toFixed(5)}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 pt-2 border-t border-slate-100">
                        <span>Göndərilmə tarixi: {(() => { const d = new Date(appeal.createdAt); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; })()}</span>
                    </div>

                    {/* Rejection Reason - only for Rejected status */}
                    {appeal.status === 'Rejected' && appeal.rejectionReason && (
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 uppercase mb-3">Rədd Səbəbi</h3>
                            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-red-800">Müraciət Rədd Edildi</p>
                                    <p className="text-red-700 text-sm mt-1 leading-relaxed">{appeal.rejectionReason}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Verification Result - only for Resolved status */}
                    {appeal.status === 'Resolved' && appeal.verification && (
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 uppercase mb-3">Həll Detalları</h3>
                            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-bold text-green-800">Həll Təsdiqləndi</p>
                                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                                        <div className="flex justify-between bg-white/70 p-2 rounded">
                                            <span className="text-slate-600">Eyni Məkan</span>
                                            <span className="font-bold">{appeal.verification.same_location ? '✅' : '❌'}</span>
                                        </div>
                                        <div className="flex justify-between bg-white/70 p-2 rounded">
                                            <span className="text-slate-600">Problem Həll Olunub</span>
                                            <span className="font-bold">{appeal.verification.issue_resolved ? '✅' : '❌'}</span>
                                        </div>
                                        <div className="flex justify-between bg-white/70 p-2 rounded">
                                            <span className="text-slate-600">Etibarlılıq</span>
                                            <span className="font-bold text-blue-600">{Math.round(appeal.verification.confidence * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
