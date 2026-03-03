import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entityModel: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
