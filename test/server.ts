import { promisifyAll } from 'bluebird';
import http from 'http';
import * as _ from 'lodash';
import request = require( 'request' );

export const config = require( './config' );

import { datas } from './mock';
import { PhoneBook, server } from './webserver-init';

interface IParamObject {
	url: string;
	json?: object | boolean;
	qs?: object;
}
type Param = IParamObject | string;

export const requestApi: {
	optionsAsync( params: Param ): Promise<[Response, any]>;
	getAsync( params: Param ): Promise<[Response, any]>;
	deleteAsync( params: Param ): Promise<[Response, any]>;
	postAsync( params: Param ): Promise<[Response, any]>;
	patchAsync( params: Param ): Promise<[Response, any]>;
	putAsync( params: Param ): Promise<[Response, any]>;
} = promisifyAll( request, {
	multiArgs: true,
} ) as any;

export const baseAPI = `http://localhost:${config.port}${config.baseApi}`;

export const compareArrays = ( a: any[], b: any[] ) => {
	expect( a ).toHaveLength( b.length );
	_.forEach( a, ( item, index ) => {
		expect( a[index] ).toMatchObject( b[index] );
	} );
};

export const resetDataSource = () =>
	beforeEach( async () => {
		await PhoneBook.deleteMany( {} );
		await PhoneBook.insertMany( datas );
	} );

let app: http.Server | undefined;

const webserverPorts = [];

beforeAll( async () => {
	// runs before all tests in this block

	app = await server( config.port );
} );
afterAll( async () => {
	// Get port: app.address().port
	// runs after all tests in this block
	return new Promise( ( resolve ) => app.close( resolve ) );
} );

export const stripIdHash = ( object: object ) => _.omit( object, ['idHash'] );
export const stripIdHashArr = ( objects: any[] ) => _.map( objects, stripIdHash );
