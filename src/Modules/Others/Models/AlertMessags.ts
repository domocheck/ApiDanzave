export const ALERT_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
};

export const ALERT_MESSAGE_ACCOUNTS = {
    ACCOUNT: 'Cuenta corriente.',
    SETTLE_ACCOUNT_SUCCESS: 'La cuenta corriente se ha actualizar con exito.',
    SETTLE_ACCOUNT_ERROR: 'No se pudo actualizar la cuenta corriente. Intente nuevamente.',
    GENERATE_ACCOUNTS_SUCCESS: 'Las cuentas se han generado con exito.',
    GENERATE_ACCOUNTS_ERROR: 'No se pudo generar las cuentas. Intente nuevamente.',
};

export const ALERT_MESSAGES_ASSISTS = {
    ASSIST: 'Asistencia.',
    ADD_ASSIST_SUCCESS: 'La Asistencia se ha generado con exito.',
    ADD_ASSIST_ERROR: 'No se pudo generar la asistencia. Intente nuevamente.',
};

export const ALERT_MESSAGES_CLASSES = {
    ADD_CLASSE: 'Clase nueva.',
    ADD_CLASSE_SUCCESS: 'La clase se ha creado con exito.',
    ADD_CLASSE_ERROR: 'No se pudo crear la clase. Intente nuevamente.',
    ADD_CLASSE_ERROR_SCHEDULE:
        'No hay disponibilidad de horario para la clase. Intenta en otro dia, horario o salon.',
    UPDATE_CLASSE: 'Clase editada.',
    UPDATE_CLASSE_SUCCESS: 'La clase se ha editado con exito.',
    UPDATE_CLASSE_ERROR: 'No se pudo editar la clase. Intente nuevamente.',
    REMOVE_CLASS: 'Clase eliminada.',
    REMOVE_CLASS_SUCCESS: 'La clase se ha eliminado con exito.',
    REMOVE_CLASS_ERROR: 'No se pudo eliminar la clase. Intente nuevamente.',
};

export const ALERT_MESSAGES_ACTIVITIES = {
    ADD_ACTIVITIES: 'Actividad nueva.',
    ADD_ACTIVITIES_SUCCESS: 'La Actividad se ha creado con exito.',
    ADD_ACTIVITIES_ERROR: 'No se pudo crear la Actividad. Intente nuevamente.',
    UPDATE_ACTIVITIES: 'Actividad editada.',
    UPDATE_ACTIVITIES_SUCCESS: 'La Actividad se ha editado con exito.',
    UPDATE_ACTIVITIES_ERROR: 'No se pudo editar la Actividad. Intente nuevamente.',
    REMOVE_ACTIVITY: 'Actividad eliminada.',
    REMOVE_ACTIVITY_SUCCESS: 'La Actividad se ha eliminado con exito.',
    REMOVE_ACTIVITY_ERROR: 'No se pudo eliminar la Actividad. Intente nuevamente.',
};

export const ALERT_MESSAGES_CONTACTS = {
    ADD_CONTACT: 'Contacto nuevo.',
    ADD_CONTACT_SUCCESS: 'el contacto se ha creado con exito.',
    ADD_CONTACT_ERROR: 'No se pudo crear el contacto. Intente nuevamente.',
    UPDATE_CONTACT: 'Contacto editado.',
    UPDATE_CONTACT_SUCCESS: 'el contacto se ha editado con exito.',
    UPDATE_CONTACT_ERROR: 'No se pudo editar el contacto. Intente nuevamente.',
    REMOVE_CONTACT: 'Contacto eliminado.',
    REMOVE_CONTACT_SUCCESS: 'el contacto se ha eliminado con exito.',
    REMOVE_CONTACT_ERROR: 'No se pudo eliminar el contacto. Intente nuevamente.',
};

export const ALERT_MESSAGES_DRAWERS = {
    DRAWER: 'Caja diaria.',
    MOVEMENT: 'Movimiento de caja',
    OPEN_DRAWER_SUCCESS: 'La caja se ha abierto con exito.',
    OPEN_DRAWER_ERROR: 'No se pudo abrir la caja. Intente nuevamente.',
    CLOSE_DRAWER_SUCCESS: 'La caja se ha cerrado con exito.',
    CLOSE_DRAWER_ERROR: 'No se pudo cerrar la caja. Intente nuevamente.',
    ADD_MOVEMENT_SUCCESS: 'El movimiento de caja se ha creado con exito.',
    ADD_MOVEMENT_ERROR: 'No se pudo crear el movimiento. Intente nuevamente.',
    REMOVE_MOVEMENT_SUCCESS: 'El movimiento de caja se ha eliminado con exito.',
    REMOVE_MOVEMENT_ERROR: 'No se pudo eliminar el movimiento. Intente nuevamente.',
    REMOVE_MOVEMENT_INFO: 'No se puede eliminar un movimiento de una caja ya cerrada.',
};

export const ALERT_MESSAGES_PERSONS = {
    INACTIVATED_PERSON: 'Inactivar persona',
    INACTIVATED_PERSON_SUCCESS: 'Se ha inactivado la persona con exito.',
    INACTIVATED_PERSON_ERROR: 'No se pudo inactivar la persona. Intente nuevamente.',
    ACTIVATED_PERSON: 'Activar persona',
    ACTIVATED_PERSON_SUCCESS: 'Se ha activado la persona con exito.',
    ACTIVATED_PERSON_ERROR: 'No se pudo activar la persona. Intente nuevamente.',
};

export const ALERT_MESSAGES_STUDENTS = {
    ADD_STUDENT: 'Alumno nuevo.',
    ADD_STUDENT_SUCCESS: 'El alumno se ha creado con exito.',
    ADD_STUDENT_ERROR: 'No se pudo crear el alumno. Intente nuevamente.',
    UPDATE_STUDENT: 'Alumno editado.',
    UPDATE_STUDENT_SUCCESS: 'El alumno se ha editado con exito.',
    UPDATE_STUDENT_ERROR: 'No se pudo editar el alumno. Intente nuevamente.',
    REMOVE_STUDENT: 'Alumno eliminado.',
    REMOVE_STUDENT_SUCCESS: 'El alumno se ha eliminado con exito.',
    REMOVE_STUDENT_ERROR: 'No se pudo eliminar el alumno. Intente nuevamente.',
};

export const ALERT_MESSAGES_TEACHERS = {
    ADD_TEACHER: 'Maestro nuevo.',
    ADD_TEACHER_SUCCESS: 'El maestro se ha creado con exito.',
    ADD_TEACHER_ERROR: 'No se pudo crear el maestro. Intente nuevamente.',
    UPDATE_TEACHER: 'Maestro editado.',
    UPDATE_TEACHER_SUCCESS: 'El maestro se ha editado con exito.',
    UPDATE_TEACHER_ERROR: 'No se pudo editar el maestro. Intente nuevamente.',
    REMOVE_TEACHER: 'Maestro eliminado.',
    REMOVE_TEACHER_SUCCESS: 'El maestro se ha eliminado con exito.',
    REMOVE_TEACHER_ERROR: 'No se pudo eliminar el maestro. Intente nuevamente.',
};

export const ALERT_MESSAGES_FORMS = {
    ASSISTS_TEACHERS: 'Asistencia maestro',
    ASISSTS_TEACHERS_INFO: 'La asistencia del maestro ya ha sido cargada.',
    OUTFITFEE: 'No hay alumno seleccionado.',
    OUTFITFEE_INFO: 'Por favor selecciona un alumno.',
    OUTFITFEE_AMOUNT: 'Monto invalido.',
    OUTFITFEE_AMOUNT_ERROR: 'Por favor ingrese un monto.',
};

export const ALERT_MESSAGES_LOGIN = {
    LOGIN: 'Iniciar sesion.',
    LOGIN_OK: 'Acceso correcto.',
    LOGIN_ERROR: 'El usuario o la contraseña son incorrectos.',
    LOGIN_ALERT: 'El usuario no esta activo.',
    LOGIN_WARNING: 'Hubo un error, intente nuevamente.',
};

export const ALERT_MESSAGES_LOGOUT = {
    LOGOUT: 'Cerrar sesion.',
    LOGOUT_OK: 'Sesion cerrada con exito.',
    LOGOUT_ERROR: 'Hubo un error, intente nuevamente.',
};

export const ALERT_MESSAGES_USERS = {
    USERS: 'Creación de usuarios',
    USER_OK: 'El usuario se ha creado con exito',
    USER_ERROR: 'El usuario ya existe.',
    USER_WARNING: 'No se pudo crear el usuario. Intente nuevamente.',
    PASS: 'Contraseña',
    PASS_CHANGE_OK: 'Se ha cambiando la contraseña con exito.',
    PASS_CHANGE_ERROR: 'No se ha podido cambiar la contraseña. Intenta nuevamente.',
    UPDATE: 'Actualizar usuario',
    UPDATE_OK: 'El usuario se actualizo con exito.',
    UPDATE_ERROR: 'No se pudo actualizar el usuario. Intente nuevamente.',
};

export const ALERT_MESSAGES_CONFIG = {
    CONFIG: 'Configuración',
    CONFIG_OK: 'Se ha guardado la configuración con exito.',
    CONFIG_ERROR: 'No se ha podido guardar la configuración. Intenta nuevamente.',
};

export const ALERT_MESSAGES_CONTACTS_ACTIVITIES = {
    UPDATE_ACTIVITY: 'Actividad cumplida.',
    UPDATE_ACTIVITY_SUCCESS: 'La actividad se ha cumplido con exito.',
    UPDATE_ACTIVITY_ERROR: 'No se pudo cumplir la actividad. Intente nuevamente.',
    ASSIGN_ACTIVITY: 'Actividad asignada.',
    ASSIGN_ACTIVITY_SUCCESS: 'La actividad se ha asignado con exito.',
    ASSIGN_ACTIVITY_ERROR: 'No se pudo asignar la actividad. Intente nuevamente.',
};

export const ALERT_MESSAGES_GENERAL = {
    SUCCES: 'Exito',
    ERROR: 'Hubo un error, por favor intente nuevamente.',
    WARNING: 'Advertencia',
};

export const ALERT_MESSAGES_PRODUCTS = {
    ADD_PRODUCT: 'Producto nuevo.',
    ADD_PRODUCT_SUCCESS: 'El producto se ha creado con exito.',
    ADD_PRODUCT_ERROR: 'No se pudo crear el producto. Intente nuevamente.',
    UPDATE_PRODUCT: 'Producto editado.',
    UPDATE_PRODUCT_SUCCESS: 'El producto se ha editado con exito.',
    UPDATE_PRODUCT_ERROR: 'No se pudo editar el producto. Intente nuevamente.',
    REMOVE_PRODUCT: 'Producto eliminado.',
    REMOVE_PRODUCT_SUCCESS: 'El producto se ha eliminado con exito.',
    REMOVE_PRODUCT_ERROR: 'No se pudo eliminar el producto. Intente nuevamente.',
};

export const ALERT_MESSAGES_SALES = {
    ADD_SALE: 'Venta nueva.',
    ADD_SALE_SUCCESS: 'La venta se ha creado con exito.',
    ADD_SALE_ERROR: 'No se pudo crear la venta. Intente nuevamente.',
    UPDATE_SALE: 'Venta editado.',
    UPDATE_SALE_SUCCESS: 'La venta se ha editado con exito.',
    UPDATE_SALE_ERROR: 'No se pudo editar la venta. Intente nuevamente.',
    REMOVE_SALE: 'Venta eliminado.',
    REMOVE_SALE_SUCCESS: 'La venta se ha eliminado con exito.',
    REMOVE_SALE_ERROR: 'No se pudo eliminar la venta. Intente nuevamente.',
};
