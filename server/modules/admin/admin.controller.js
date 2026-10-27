import * as adminService from './admin.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export async function getStaff(_req, res, next) {
  try {
    const staff = await adminService.listStaff();
    return successResponse(res, staff);
  } catch (err) {
    next(err);
  }
}

export async function createStaff(req, res, next) {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return errorResponse(res, 'Full name, email, and password are required', 'VALIDATION_ERROR', 400);
    }
    const staff = await adminService.createStaff({ fullName, email, password, role }, req.user?.id);
    return successResponse(res, staff, 201, { message: 'Staff member added successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateStaffStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['active', 'suspended'].includes(status)) {
      return errorResponse(res, 'Valid status (active or suspended) is required', 'VALIDATION_ERROR', 400);
    }
    const result = await adminService.updateStaffStatus(id, status, req.user?.id);
    return successResponse(res, result, 200, { message: 'Staff status updated' });
  } catch (err) {
    next(err);
  }
}

export async function getPolicies(_req, res, next) {
  try {
    const policies = await adminService.getPolicies();
    return successResponse(res, policies);
  } catch (err) {
    next(err);
  }
}

export async function updatePolicies(req, res, next) {
  try {
    const updated = await adminService.updatePolicies(req.body, req.user?.id);
    return successResponse(res, updated, 200, { message: 'Policies updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogs(req, res, next) {
  try {
    const { action, actorId, page, limit } = req.query;
    const result = await adminService.getAuditLogs({ action, actorId, page, limit });
    return successResponse(res, result.logs, 200, { pagination: result.pagination });
  } catch (err) {
    next(err);
  }
}
