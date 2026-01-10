import { PermissionResponseMethod } from "@/types";

export const getMethodColor = (method?: PermissionResponseMethod) => {
  const colors = {
    [PermissionResponseMethod.GET]: 'bg-green-500/10 text-green-600 border-green-500/20',
    [PermissionResponseMethod.POST]: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    [PermissionResponseMethod.PUT]: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    [PermissionResponseMethod.DELETE]: 'bg-red-500/10 text-red-600 border-red-500/20',
    [PermissionResponseMethod.PATCH]: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  } as {[key in PermissionResponseMethod]: string};
  return method ? colors[method] : 'bg-gray-500/10 text-gray-600 border-gray-500/20';
};
