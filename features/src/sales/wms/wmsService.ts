import {
  addOrUpdateServiceFactory,
  archiveServiceFactory,
  filterServiceFactory,
  getByIdServiceFactory,
  recoverServiceFactory,
} from '../../core/crud/crudService';
import { api } from '../../core/service';
import {
  Wms,
  WmsCategory,
  WmsFilter,
  WmsTag,
} from './wmsModels';
import { trafficControllerThunkFactory } from '../../core/utils';

const wmsServiceBaseUrl = 'wms';

export const wmsService = api.injectEndpoints({
  endpoints: (build) => ({
    wms: filterServiceFactory<Wms, WmsFilter>(
      build,
      wmsServiceBaseUrl
    ),
    wmsById: getByIdServiceFactory<Wms>(
      build,
      wmsServiceBaseUrl
    ),
    addOrUpdateWms: addOrUpdateServiceFactory<Wms>(
      build,
      wmsServiceBaseUrl,
      (dispatch, handler) => {
        dispatch(
          wmsService.util.updateQueryData('wms', undefined, handler)
        );
      }
    ),
    archiveWms: archiveServiceFactory<Wms>(
      build,
      wmsServiceBaseUrl,
      (dispatch, handler) => {
        dispatch(
          wmsService.util.updateQueryData('wms', undefined, handler)
        );
      }
    ),
    recoverWms: recoverServiceFactory<Wms>(
      build,
      wmsServiceBaseUrl,
      (dispatch, handler) => {
        dispatch(
          wmsService.util.updateQueryData('wms', undefined, handler)
        );
      }
    ),
    getAllWms: build.query<Wms[], void>({
      query: () => ({
        url: wmsServiceBaseUrl,
        params: {
          Skip: 0,
          Top: 1000,
        },
      }),
    }),
    _checkWmsName: build.mutation<void, { name: string; id?: number }>({
      query: (params) => ({
        url: `${wmsServiceBaseUrl}/check-name`,
        method: 'POST',
        body: params,
      }),
    }),
    wmsCategories: build.query<WmsCategory[], void>({
      query: () => ({
        url: 'wms-category',
      }),
    }),
    wmsTags: build.query<WmsTag[], void>({
      query: () => ({
        url: 'wms-tag',
      }),
    }),
  }),
});

export const checkWmsName = trafficControllerThunkFactory<
  { name: string; id?: number },
  void
>((params) => wmsService.endpoints._checkWmsName.initiate(params));

export const {
  useWmsQuery,
  useWmsByIdQuery,
  useAddOrUpdateWmsMutation,
  useGetAllWmsQuery,
  useWmsCategoriesQuery,
  useWmsTagsQuery,
} = wmsService;
