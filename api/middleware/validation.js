import { check, validationResult } from 'express-validator'

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: "Erro de validação",
            errors: errors.array()
        })
    }
    next()
}

export const validateLivro = [
    check('titulo')
        .notEmpty().withMessage('O título é obrigatório')
        .isString().withMessage('O título deve ser uma string')
        .isLength({ min: 3 }).withMessage('O título deve ter pelo menos 3 caracteres'),

    check('autor')
        .notEmpty().withMessage('O autor é obrigatório')
        .isString().withMessage('O autor deve ser uma string')
        .isLength({ min: 3 }).withMessage('O autor deve ter pelo menos 3 caracteres'),

    check('avaliacao')
        .optional()
        .isFloat({ min: 0, max: 10 }).withMessage('A avaliação deve ser um número entre 0 e 5'),


    check('data_leitura')
        .optional()
        .isISO8601().withMessage('A data de leitura deve estar no formato ISO (YYYY-MM-DD)'),

    check('descricao')
        .optional()
        .isString().withMessage('A descrição deve ser uma string')
        .isLength({ min: 10 }).withMessage('A descrição deve ter pelo menos 10 caracteres'),

    validateRequest
]
